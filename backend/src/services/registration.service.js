import mongoose from 'mongoose';
import QRCodeLib from 'qrcode';
import { Registration } from '../models/registration.model.js';
import { User } from '../models/user.model.js';
import { PersonalInformation } from '../models/personalInformation.model.js';
import { EmergencyContact } from '../models/emergencyContact.model.js';
import { MedicalProfile } from '../models/medicalProfile.model.js';
import { TravelInformation } from '../models/travelInformation.model.js';
import { Accommodation } from '../models/accommodation.model.js';
import { FamilyMember } from '../models/familyMember.model.js';
import { DigitalPass } from '../models/digitalPass.model.js';
import { ScanLog } from '../models/scanLog.model.js';
import { Event } from '../models/event.model.js';
import { ActivityLog } from '../models/activityLog.model.js';
import { ApiError } from '../utils/ApiError.js';
import { getPagination, buildPaginationMeta } from '../helpers/pagination.helper.js';
import { generateUniqueCode } from '../utils/generateCode.js';
import { signDraftToken } from '../helpers/token.helper.js';
import { REGISTRATION_STATUS } from '../constants/registrationStatus.js';
import { STEP_STATUS } from '../constants/stepStatus.js';
import { WIZARD_STEPS, WIZARD_STEP_VALUES } from '../constants/wizardSteps.js';
import { EVENT_STATUS } from '../constants/eventStatus.js';
import { DIGITAL_PASS_STATUS, VERIFICATION_STATUS } from '../constants/digitalPassStatus.js';
import { getStateCode } from '../constants/stateCodes.js';
import config from '../config/env.js';
import * as qrService from './qr.service.js';
import * as dashboardService from './dashboard.service.js';
import { logActivity } from './activityLog.service.js';
import { logAudit, listAuditLogs } from './auditLog.service.js';
import { createNotification } from './notification.service.js';
import * as documentService from './document.service.js';

const STEP_MODEL_MAP = {
  [WIZARD_STEPS.PERSONAL_INFORMATION]: PersonalInformation,
  [WIZARD_STEPS.EMERGENCY_CONTACT]: EmergencyContact,
  [WIZARD_STEPS.MEDICAL_INFORMATION]: MedicalProfile,
  [WIZARD_STEPS.TRAVEL_INFORMATION]: TravelInformation,
  [WIZARD_STEPS.ACCOMMODATION]: Accommodation,
};

// familyMembers is intentionally excluded — not every citizen travels with
// family, so it doesn't block final submit.
const REQUIRED_STEPS = [
  WIZARD_STEPS.PERSONAL_INFORMATION,
  WIZARD_STEPS.EMERGENCY_CONTACT,
  WIZARD_STEPS.MEDICAL_INFORMATION,
  WIZARD_STEPS.TRAVEL_INFORMATION,
  WIZARD_STEPS.ACCOMMODATION,
];

const MAX_SUBMIT_RETRIES = 5;

// A registration stays editable while still draft, or after an admin has
// explicitly asked for more information (see requestMoreInfo below) — the
// request would otherwise be meaningless since the citizen could never act
// on it.
const EDITABLE_STATUSES = [REGISTRATION_STATUS.DRAFT, REGISTRATION_STATUS.INFO_REQUESTED];

const assertDraftEditable = (registration) => {
  if (!EDITABLE_STATUSES.includes(registration.registrationStatus)) {
    throw ApiError.badRequest('This registration is no longer editable');
  }
};

const escapeRegExp = (value) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const computeCompletionPercentage = (stepStatus) => {
  const done = WIZARD_STEP_VALUES.filter(
    (key) => stepStatus[key] === STEP_STATUS.COMPLETED || stepStatus[key] === STEP_STATUS.SKIPPED
  ).length;
  return Math.round((done / WIZARD_STEP_VALUES.length) * 100);
};

const getCurrentStep = (stepStatus) =>
  WIZARD_STEP_VALUES.find((key) => stepStatus[key] === STEP_STATUS.PENDING) || null;

const buildWizardProgress = (registration) => {
  const stepStatus = registration.stepStatus.toObject
    ? registration.stepStatus.toObject()
    : registration.stepStatus;

  return {
    registrationId: registration._id,
    registrationStatus: registration.registrationStatus,
    rejectionReason: registration.rejectionReason || null,
    statusNote: registration.statusNote || null,
    stepStatus,
    completionPercentage: registration.completionPercentage,
    currentStep: getCurrentStep(stepStatus),
    registrationNumber: registration.registrationNumber,
    pilgrimId: registration.pilgrimId,
  };
};

export const startRegistration = async ({ code }, meta = {}) => {
  const cleanCode = (code || '').trim();
  console.log('[QR LOOKUP DEBUG] Decoded QR payload / Incoming request code:', cleanCode);

  // 1. Check if cleanCode matches an existing registration record (by registrationNumber, pilgrimId, _id, userId, DigitalPass qrCode, or Event QR)
  if (cleanCode) {
    const isMongoId = mongoose.Types.ObjectId.isValid(cleanCode);
    const upperCode = cleanCode.toUpperCase();

    const queryConditions = [
      { registrationNumber: upperCode },
      { pilgrimId: upperCode },
    ];
    if (isMongoId) {
      queryConditions.push({ _id: cleanCode });
      queryConditions.push({ userId: cleanCode });
    }

    const passDoc = await DigitalPass.findOne({
      $or: [{ qrCode: cleanCode }, ...(isMongoId ? [{ _id: cleanCode }] : [])],
    });
    if (passDoc) {
      queryConditions.push({ _id: passDoc.registrationId });
      queryConditions.push({ digitalPassId: passDoc._id });
    }

    // Also validate if cleanCode is an event QR code (used later to create a new draft — NOT for resuming)
    const qrDoc = await qrService.validateQRForRegistration(cleanCode).catch(() => null);

    console.log('[QR LOOKUP DEBUG] Database query being executed:', JSON.stringify(queryConditions));
    const existingReg = await Registration.findOne({ $or: queryConditions }).sort({ createdAt: -1 });
    console.log(
      '[QR LOOKUP DEBUG] Database query result:',
      existingReg ? `Found registration ID ${existingReg._id} (${existingReg.registrationNumber || 'Draft'})` : 'No existing registration matched'
    );

    if (existingReg) {
      const draftToken = signDraftToken({
        registrationId: existingReg._id.toString(),
        userId: existingReg.userId.toString(),
        eventId: existingReg.eventId.toString(),
      });
      return { draftToken, ...buildWizardProgress(existingReg) };
    }
  }

  // 2. If no existing registration matched, validate code as an event QR code to start new draft
  let qr = null;
  try {
    qr = await qrService.validateQRForRegistration(cleanCode);
  } catch (qrErr) {
    console.log('[QR LOOKUP DEBUG] Event QR validation failed for code:', cleanCode, 'Error:', qrErr.message);
  }

  if (!qr) {
    console.log(
      '[QR LOOKUP DEBUG] Exact reason why "No registration found" is returned: Code "' +
      cleanCode +
      '" did not match any existing Registration (by registrationNumber, pilgrimId, _id, userId, digitalPass) AND did not match any active Event QR code.'
    );
    throw ApiError.notFound(`No registration found for code: ${cleanCode}`);
  }

  const event = qr.eventId;

  if (event.status !== EVENT_STATUS.ACTIVE) {
    throw ApiError.badRequest(`Event is ${event.status} and is not currently open for registration`);
  }

  const now = new Date();
  if (event.registrationStartDate && now < event.registrationStartDate) {
    throw ApiError.badRequest('Registration has not opened for this event yet');
  }
  if (event.registrationEndDate && now > event.registrationEndDate) {
    throw ApiError.badRequest('Registration has closed for this event');
  }
  if (event.capacity) {
    const count = await Registration.countDocuments({
      eventId: event._id,
      registrationStatus: { $ne: REGISTRATION_STATUS.DRAFT },
    });
    if (count >= event.capacity) throw ApiError.badRequest('This event has reached registration capacity');
  }

  const user = await User.create({});

  const registration = await Registration.create({
    eventId: event._id,
    qrId: qr._id,
    userId: user._id,
  });

  // Counts as exactly one successful scan — right here, once per new
  // registration actually created through this QR. Refreshing/resuming an
  // in-progress draft never reaches this line again (useStartOrResumeDraft
  // on the frontend resumes via getDraft() instead once a session exists),
  // so a page refresh can never double-count. The old public GET
  // /api/v1/qr/:code route also tracked scans, but nothing in the app's
  // real flow ever calls it — the QR encodes a link straight into this
  // wizard, not that API endpoint — so it was silently dead code and
  // scanCount never actually moved.
  await qrService.incrementScanCount(qr._id);

  await Promise.all([
    PersonalInformation.create({ userId: user._id, registrationId: registration._id }),
    EmergencyContact.create({ userId: user._id, registrationId: registration._id }),
    MedicalProfile.create({ userId: user._id, registrationId: registration._id }),
    TravelInformation.create({ userId: user._id, registrationId: registration._id }),
    Accommodation.create({ userId: user._id, registrationId: registration._id }),
  ]);

  await logActivity({
    actorType: 'user',
    actorId: user._id,
    userId: user._id,
    registrationId: registration._id,
    action: 'registration.started',
    metadata: { eventId: event._id },
    ipAddress: meta.ipAddress,
    userAgent: meta.userAgent,
  });

  const draftToken = signDraftToken({
    registrationId: registration._id.toString(),
    userId: user._id.toString(),
    eventId: event._id.toString(),
  });

  return { draftToken, ...buildWizardProgress(registration) };
};

const saveStep = async (stepKey, registration, payload, meta = {}) => {
  assertDraftEditable(registration);

  const Model = STEP_MODEL_MAP[stepKey];
  const doc = await Model.findOneAndUpdate(
    { registrationId: registration._id },
    { $set: { data: payload, status: STEP_STATUS.COMPLETED, completedAt: new Date() } },
    { new: true, runValidators: true }
  );

  if (!doc) {
    throw ApiError.notFound('Step record not found for this registration');
  }

  registration.stepStatus[stepKey] = STEP_STATUS.COMPLETED;
  registration.completionPercentage = computeCompletionPercentage(registration.stepStatus);
  await registration.save();

  await logActivity({
    actorType: 'user',
    actorId: registration.userId,
    userId: registration.userId,
    registrationId: registration._id,
    action: 'registration.step_saved',
    metadata: { step: stepKey },
    ipAddress: meta.ipAddress,
    userAgent: meta.userAgent,
  });

  return {
    step: { key: stepKey, status: doc.status, data: doc.data, completedAt: doc.completedAt },
    ...buildWizardProgress(registration),
  };
};

export const savePersonalInformation = (registration, payload, meta) =>
  saveStep(WIZARD_STEPS.PERSONAL_INFORMATION, registration, payload, meta);

export const saveEmergencyContact = (registration, payload, meta) =>
  saveStep(WIZARD_STEPS.EMERGENCY_CONTACT, registration, payload, meta);

export const saveMedicalInformation = (registration, payload, meta) =>
  saveStep(WIZARD_STEPS.MEDICAL_INFORMATION, registration, payload, meta);

export const saveTravelInformation = (registration, payload, meta) =>
  saveStep(WIZARD_STEPS.TRAVEL_INFORMATION, registration, payload, meta);

export const saveAccommodation = (registration, payload, meta) =>
  saveStep(WIZARD_STEPS.ACCOMMODATION, registration, payload, meta);

const syncFamilyStepStatus = async (registration) => {
  const count = await FamilyMember.countDocuments({ registrationId: registration._id });
  registration.stepStatus.familyMembers = count > 0 ? STEP_STATUS.COMPLETED : STEP_STATUS.PENDING;
  registration.completionPercentage = computeCompletionPercentage(registration.stepStatus);
  await registration.save();
};

export const listFamilyMembers = async (registration) =>
  FamilyMember.find({ registrationId: registration._id }).sort({ createdAt: 1 });

export const saveFamilyMembers = async (registration, members, meta = {}) => {
  assertDraftEditable(registration);

  await FamilyMember.deleteMany({ registrationId: registration._id });

  const docs = members.length
    ? await FamilyMember.insertMany(
      members.map((data) => ({
        userId: registration.userId,
        registrationId: registration._id,
        data,
        status: STEP_STATUS.COMPLETED,
        completedAt: new Date(),
      }))
    )
    : [];

  await syncFamilyStepStatus(registration);

  await logActivity({
    actorType: 'user',
    actorId: registration.userId,
    userId: registration.userId,
    registrationId: registration._id,
    action: 'registration.step_saved',
    metadata: { step: WIZARD_STEPS.FAMILY_MEMBERS, count: docs.length },
    ipAddress: meta.ipAddress,
    userAgent: meta.userAgent,
  });

  return { members: docs, ...buildWizardProgress(registration) };
};

export const addFamilyMember = async (registration, payload, meta = {}) => {
  assertDraftEditable(registration);

  const member = await FamilyMember.create({
    userId: registration.userId,
    registrationId: registration._id,
    data: payload,
    status: STEP_STATUS.COMPLETED,
    completedAt: new Date(),
  });

  await syncFamilyStepStatus(registration);

  await logActivity({
    actorType: 'user',
    actorId: registration.userId,
    userId: registration.userId,
    registrationId: registration._id,
    action: 'registration.family_member_added',
    metadata: { familyMemberId: member._id },
    ipAddress: meta.ipAddress,
    userAgent: meta.userAgent,
  });

  return { member, ...buildWizardProgress(registration) };
};

export const updateFamilyMember = async (registration, memberId, payload, meta = {}) => {
  assertDraftEditable(registration);

  const member = await FamilyMember.findOneAndUpdate(
    { _id: memberId, registrationId: registration._id },
    { $set: { data: payload, completedAt: new Date() } },
    { new: true, runValidators: true }
  );

  if (!member) {
    throw ApiError.notFound('Family member not found for this registration');
  }

  await logActivity({
    actorType: 'user',
    actorId: registration.userId,
    userId: registration.userId,
    registrationId: registration._id,
    action: 'registration.family_member_updated',
    metadata: { familyMemberId: member._id },
    ipAddress: meta.ipAddress,
    userAgent: meta.userAgent,
  });

  return { member, ...buildWizardProgress(registration) };
};

export const deleteFamilyMember = async (registration, memberId, meta = {}) => {
  assertDraftEditable(registration);

  const member = await FamilyMember.findOneAndDelete({
    _id: memberId,
    registrationId: registration._id,
  });

  if (!member) {
    throw ApiError.notFound('Family member not found for this registration');
  }

  await syncFamilyStepStatus(registration);

  await logActivity({
    actorType: 'user',
    actorId: registration.userId,
    userId: registration.userId,
    registrationId: registration._id,
    action: 'registration.family_member_removed',
    metadata: { familyMemberId: memberId },
    ipAddress: meta.ipAddress,
    userAgent: meta.userAgent,
  });

  return buildWizardProgress(registration);
};

// Shared by getDraft (citizen wizard/dashboard) and getRegistrationById
// (admin detail view, which remaps these into its own response shape) —
// one place for this Promise.all instead of two separate copies.
export const assembleRegistrationDetail = async (registration) => {
  const [
    personalInformation,
    emergencyContact,
    medicalProfile,
    travelInformation,
    accommodation,
    familyMembers,
    digitalPass,
    event,
  ] = await Promise.all([
    PersonalInformation.findOne({ registrationId: registration._id }),
    EmergencyContact.findOne({ registrationId: registration._id }),
    MedicalProfile.findOne({ registrationId: registration._id }),
    TravelInformation.findOne({ registrationId: registration._id }),
    Accommodation.findOne({ registrationId: registration._id }),
    FamilyMember.find({ registrationId: registration._id }).sort({ createdAt: 1 }),
    registration.digitalPassId
      ? DigitalPass.findById(registration.digitalPassId)
      : DigitalPass.findOne({ registrationId: registration._id }),
    // Read-only, public-safe event summary — the citizen's own dashboard
    // has no other way to know which event they registered for.
    Event.findById(registration.eventId).select('name startDate endDate venue status'),
  ]);

  return {
    personalInformation,
    emergencyContact,
    medicalProfile,
    travelInformation,
    accommodation,
    familyMembers,
    digitalPass,
    event,
  };
};

// A pass is "activated" once an operator has actually verified this
// pilgrim at the gate (an approved ScanLog entry ever exists for it) — not
// merely once DigitalPass.status is 'active' (that's set at submit time,
// unrelated to on-site verification; unchanged, see submitRegistration).
// This is a read-only signal computed only for the citizen-facing draft
// response below — QR generation/storage and the operator verification
// flow are untouched.
const isPassActivated = async (digitalPassId) =>
  digitalPassId ? Boolean(await ScanLog.exists({ digitalPassId, result: 'approved' })) : false;

export const getEffectiveVerificationStatus = (digitalPass) => {
  return digitalPass?.verificationStatus || VERIFICATION_STATUS.PENDING;
};

// The citizen's own view of their registration. The QR code/image and
// pilgrimId are confidential until the pilgrim is actually verified at the
// gate — this is the ONLY place that redaction happens; admin
// (getRegistrationById) and the operator (verifyPass) both call
// assembleRegistrationDetail directly and keep seeing everything, since
// neither goes through getDraft.
export const getDraft = async (registration) => {
  const { pilgrimId: _pilgrimId, ...progress } = buildWizardProgress(registration);
  const detail = await assembleRegistrationDetail(registration);

  const isSubmitted =
    registration.registrationStatus && registration.registrationStatus !== REGISTRATION_STATUS.DRAFT;

  let digitalPass = detail.digitalPass;
  if (!digitalPass && isSubmitted) {
    digitalPass = await DigitalPass.findOne({ registrationId: registration._id });
  }

  const passActivated = await isPassActivated(digitalPass?._id);
  const verificationStatus = getEffectiveVerificationStatus(digitalPass, registration.registrationStatus);

  const finalDigitalPass = isSubmitted
    ? {
      ...(digitalPass ? digitalPass.toObject() : {}),
      passNumber: digitalPass?.passNumber || registration.registrationNumber,
      verificationStatus,
      qrCode: passActivated ? digitalPass?.qrCode : null,
      qrImage: passActivated ? digitalPass?.qrImage : null,
      passActivated,
    }
    : digitalPass
      ? {
        ...digitalPass.toObject(),
        verificationStatus,
        qrCode: passActivated ? digitalPass.qrCode : null,
        qrImage: passActivated ? digitalPass.qrImage : null,
        passActivated,
      }
      : null;

  return {
    ...progress,
    ...detail,
    digitalPass: finalDigitalPass,
  };
};

export const listActivity = async (registration) =>
  ActivityLog.find({ registrationId: registration._id }).sort({ createdAt: -1 });

export const submitRegistration = async (registration, meta = {}) => {
  assertDraftEditable(registration);

  const incompleteSteps = REQUIRED_STEPS.filter(
    (step) => registration.stepStatus[step] !== STEP_STATUS.COMPLETED
  );
  if (incompleteSteps.length > 0) {
    throw ApiError.badRequest(
      'Complete all required steps before submitting',
      incompleteSteps.map((step) => ({ field: step, message: 'Step is not completed' }))
    );
  }

  // Every pilgrim gets their own account (email+password, set via the
  // Personal Information step — see pilgrimAuth.service.js's
  // setCredentials) so they can log back in later without their draft
  // token. Submit is the natural, final gate for that requirement, same
  // as the required-steps check above.
  const accountUser = await User.findById(registration.userId).select('+password');
  if (!accountUser?.password) {
    throw ApiError.badRequest('Set your account password in Personal Information before submitting', [
      { field: 'password', message: 'Account password is required' },
    ]);
  }

  await qrService.validateQRById(registration.qrId);

  const event = await Event.findById(registration.eventId);
  if (!event) {
    throw ApiError.notFound('Event not found');
  }
  if (event.status === EVENT_STATUS.CANCELLED || event.status === EVENT_STATUS.COMPLETED) {
    throw ApiError.badRequest(`Event is ${event.status} and no longer accepting submissions`);
  }

  const year = new Date().getFullYear();
  const yearStart = new Date(`${year}-01-01T00:00:00.000Z`);
  const yearEnd = new Date(`${year + 1}-01-01T00:00:00.000Z`);

  // Registration Number format is KP{year}{stateCode}{sequence}, where
  // stateCode comes from the pilgrim's own State answer (Personal
  // Information) rather than the fixed, deployment-wide
  // PILGRIM_ID_REGION_CODE that pilgrimId below still uses — the two
  // identifiers are deliberately generated independently (separate counts,
  // separate formats) so this change can't alter pilgrimId's existing
  // behavior at all.
  const personalInfo = await PersonalInformation.findOne({ registrationId: registration._id });
  const stateCode = getStateCode(personalInfo?.data?.state);

  let registrationNumber;
  let pilgrimId;
  let attempt = 0;
  let succeeded = false;

  while (attempt < MAX_SUBMIT_RETRIES && !succeeded) {
    const [lastStateReg, lastGlobalReg] = await Promise.all([
      Registration.findOne({
        registrationNumber: { $regex: `^KP${year}${stateCode}` },
      }).sort({ registrationNumber: -1 }),
      Registration.findOne({
        pilgrimId: { $regex: `^KP${year}${config.pilgrimIdRegionCode}` },
      }).sort({ pilgrimId: -1 }),
    ]);

    const lastStateSequence = lastStateReg && lastStateReg.registrationNumber
      ? parseInt(lastStateReg.registrationNumber.slice(-6), 10)
      : 0;
    const lastGlobalSequence = lastGlobalReg && lastGlobalReg.pilgrimId
      ? parseInt(lastGlobalReg.pilgrimId.slice(-6), 10)
      : 0;

    const stateSequence = String(lastStateSequence + 1 + attempt).padStart(6, '0');
    const globalSequence = String(lastGlobalSequence + 1 + attempt).padStart(6, '0');
    registrationNumber = `KP${year}${stateCode}${stateSequence}`;
    pilgrimId = `KP${year}${config.pilgrimIdRegionCode}${globalSequence}`;

    // Belt-and-braces: registrationNumber becomes DigitalPass.passNumber
    // later in this function, so a candidate that looks free in
    // `registrations` (e.g. because its owning Registration was deleted
    // outside deleteRegistrationCascade, leaving an orphaned DigitalPass
    // behind) must also be confirmed free in `digitalpasses` before we
    // commit to it — otherwise the loop "succeeds" here only to blow up
    // later as a passNumber duplicate that this retry loop never sees.
    const passNumberTaken = await DigitalPass.exists({ passNumber: registrationNumber });
    if (passNumberTaken) {
      attempt += 1;
      continue;
    }

    try {
      registration.registrationStatus = REGISTRATION_STATUS.SUBMITTED;
      registration.submittedAt = new Date();
      registration.registrationNumber = registrationNumber;
      registration.pilgrimId = pilgrimId;
      registration.dashboardCreated = true;
      await registration.save();
      succeeded = true;
    } catch (err) {
      if (err.code !== 11000) {
        throw err;
      }
      attempt += 1;
    }
  }

  if (!succeeded) {
    throw ApiError.conflict('Could not allocate a unique registration number, please retry submission');
  }

  const passUniqueCode = generateUniqueCode();
  const passUrl = `${config.frontendUrl}/pass/${passUniqueCode}`;
  const qrImage = await QRCodeLib.toDataURL(passUrl);

  // Idempotent by registrationId: a genuine duplicate submit (double-click,
  // client retry-on-timeout) can reach this point twice for the same
  // registration after both concurrently pass the draft-editable/number
  // checks above. findOneAndUpdate+upsert makes "does a pass already exist
  // for this registration" and "create/update it" a single atomic
  // operation, so the second call updates the same document instead of
  // racing a second insert into a passNumber-unique collection.
  const digitalPass = await DigitalPass.findOneAndUpdate(
    { registrationId: registration._id },
    {
      $set: {
        userId: registration.userId,
        eventId: registration.eventId,
        passNumber: registrationNumber,
        qrCode: passUniqueCode,
        qrImage,
        status: DIGITAL_PASS_STATUS.ACTIVE,
        verificationStatus: VERIFICATION_STATUS.PENDING,
        issuedAt: new Date(),
      },
    },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  );

  registration.digitalPassId = digitalPass._id;
  await registration.save();

  await dashboardService.getOrCreateDashboard(registration.userId);

  await logActivity({
    actorType: 'user',
    actorId: registration.userId,
    userId: registration.userId,
    registrationId: registration._id,
    action: 'registration.submitted',
    metadata: { registrationNumber, pilgrimId },
    ipAddress: meta.ipAddress,
    userAgent: meta.userAgent,
  });

  await logActivity({
    actorType: 'system',
    actorId: digitalPass._id,
    userId: registration.userId,
    registrationId: registration._id,
    action: 'registration.pass_generated',
    metadata: { passNumber: registrationNumber },
  });

  await logAudit({
    entityType: 'Registration',
    entityId: registration._id,
    action: 'status_changed',
    performedBy: null,
    beforeState: { registrationStatus: REGISTRATION_STATUS.DRAFT },
    afterState: { registrationStatus: REGISTRATION_STATUS.SUBMITTED, registrationNumber, pilgrimId },
  });

  await createNotification({
    userId: registration.userId,
    registrationId: registration._id,
    type: 'registration_submitted',
    title: 'Registration submitted',
    message: `Your registration was submitted successfully. Registration Number: ${registrationNumber}, Pilgrim ID: ${pilgrimId}.`,
  });

  return {
    registrationNumber,
    pilgrimId,
    // Frontend origin, not the API's — this is a page route (React Router's
    // /dashboard), not an endpoint. No userId param: the dashboard reads the
    // citizen's session from their persisted draft token, not a URL segment.
    dashboardUrl: `${config.frontendUrl}/dashboard`,
  };
};

export const approveRegistration = async (id, adminId) => {
  const registration = await Registration.findById(id);
  if (!registration) {
    throw ApiError.notFound('Registration not found');
  }
  if (registration.registrationStatus !== REGISTRATION_STATUS.SUBMITTED) {
    throw ApiError.badRequest(
      `Registration must be submitted before it can be approved (current status: ${registration.registrationStatus})`
    );
  }

  const beforeState = { registrationStatus: registration.registrationStatus };

  registration.registrationStatus = REGISTRATION_STATUS.APPROVED;
  registration.approvedAt = new Date();
  registration.reviewedBy = adminId;
  await registration.save();

  await logActivity({
    actorType: 'admin',
    actorId: adminId,
    userId: registration.userId,
    registrationId: registration._id,
    action: 'registration.approved',
  });

  await logAudit({
    entityType: 'Registration',
    entityId: registration._id,
    action: 'status_changed',
    performedBy: adminId,
    beforeState,
    afterState: { registrationStatus: REGISTRATION_STATUS.APPROVED },
  });

  await createNotification({
    userId: registration.userId,
    registrationId: registration._id,
    type: 'registration_approved',
    title: 'Registration approved',
    message: 'Your registration has been approved.',
  });

  return registration;
};

export const rejectRegistration = async (id, adminId, reason) => {
  const registration = await Registration.findById(id);
  if (!registration) {
    throw ApiError.notFound('Registration not found');
  }
  if (registration.registrationStatus !== REGISTRATION_STATUS.SUBMITTED) {
    throw ApiError.badRequest(
      `Registration must be submitted before it can be rejected (current status: ${registration.registrationStatus})`
    );
  }

  const beforeState = { registrationStatus: registration.registrationStatus };

  registration.registrationStatus = REGISTRATION_STATUS.REJECTED;
  registration.rejectedAt = new Date();
  registration.reviewedBy = adminId;
  registration.rejectionReason = reason;
  await registration.save();



  await logActivity({
    actorType: 'admin',
    actorId: adminId,
    userId: registration.userId,
    registrationId: registration._id,
    action: 'registration.rejected',
    metadata: { reason },
  });

  await logAudit({
    entityType: 'Registration',
    entityId: registration._id,
    action: 'status_changed',
    performedBy: adminId,
    beforeState,
    afterState: { registrationStatus: REGISTRATION_STATUS.REJECTED },
    reason,
  });

  await createNotification({
    userId: registration.userId,
    registrationId: registration._id,
    type: 'registration_rejected',
    title: 'Registration rejected',
    message: `Your registration was rejected. Reason: ${reason}`,
  });

  return registration;
};

export const requestMoreInfo = async (id, adminId, reason) => {
  const registration = await Registration.findById(id);
  if (!registration) {
    throw ApiError.notFound('Registration not found');
  }
  if (registration.registrationStatus !== REGISTRATION_STATUS.SUBMITTED) {
    throw ApiError.badRequest(
      `Registration must be submitted before requesting more information (current status: ${registration.registrationStatus})`
    );
  }

  const beforeState = { registrationStatus: registration.registrationStatus };

  registration.registrationStatus = REGISTRATION_STATUS.INFO_REQUESTED;
  registration.infoRequestedAt = new Date();
  registration.reviewedBy = adminId;
  registration.statusNote = reason;
  await registration.save();

  await logActivity({
    actorType: 'admin',
    actorId: adminId,
    userId: registration.userId,
    registrationId: registration._id,
    action: 'registration.info_requested',
    metadata: { reason },
  });

  await logAudit({
    entityType: 'Registration',
    entityId: registration._id,
    action: 'status_changed',
    performedBy: adminId,
    beforeState,
    afterState: { registrationStatus: REGISTRATION_STATUS.INFO_REQUESTED },
    reason,
  });

  await createNotification({
    userId: registration.userId,
    registrationId: registration._id,
    type: 'registration_info_requested',
    title: 'More information requested',
    message: `Please provide more information: ${reason}`,
  });

  return registration;
};

export const suspendRegistration = async (id, adminId, reason) => {
  const registration = await Registration.findById(id);
  if (!registration) {
    throw ApiError.notFound('Registration not found');
  }
  if (
    ![REGISTRATION_STATUS.SUBMITTED, REGISTRATION_STATUS.APPROVED].includes(
      registration.registrationStatus
    )
  ) {
    throw ApiError.badRequest(
      `Only submitted or approved registrations can be suspended (current status: ${registration.registrationStatus})`
    );
  }

  const beforeState = { registrationStatus: registration.registrationStatus };

  registration.registrationStatus = REGISTRATION_STATUS.SUSPENDED;
  registration.suspendedAt = new Date();
  registration.reviewedBy = adminId;
  registration.statusNote = reason;
  await registration.save();

  await logActivity({
    actorType: 'admin',
    actorId: adminId,
    userId: registration.userId,
    registrationId: registration._id,
    action: 'registration.suspended',
    metadata: { reason },
  });

  await logAudit({
    entityType: 'Registration',
    entityId: registration._id,
    action: 'status_changed',
    performedBy: adminId,
    beforeState,
    afterState: { registrationStatus: REGISTRATION_STATUS.SUSPENDED },
    reason,
  });

  await createNotification({
    userId: registration.userId,
    registrationId: registration._id,
    type: 'registration_suspended',
    title: 'Registration suspended',
    message: `Your registration has been suspended. Reason: ${reason}`,
  });

  return registration;
};

export const restoreRegistration = async (id, adminId) => {
  const registration = await Registration.findById(id);
  if (!registration) {
    throw ApiError.notFound('Registration not found');
  }
  if (registration.registrationStatus !== REGISTRATION_STATUS.SUSPENDED) {
    throw ApiError.badRequest(
      `Only suspended registrations can be restored (current status: ${registration.registrationStatus})`
    );
  }

  const beforeState = { registrationStatus: registration.registrationStatus };
  const restoredStatus = registration.approvedAt
    ? REGISTRATION_STATUS.APPROVED
    : REGISTRATION_STATUS.SUBMITTED;

  registration.registrationStatus = restoredStatus;
  registration.restoredAt = new Date();
  registration.reviewedBy = adminId;
  await registration.save();

  const restoredVerificationStatus = restoredStatus === REGISTRATION_STATUS.APPROVED
    ? VERIFICATION_STATUS.APPROVED
    : VERIFICATION_STATUS.PENDING;

  if (registration.digitalPassId) {
    await DigitalPass.findByIdAndUpdate(registration.digitalPassId, {
      verificationStatus: restoredVerificationStatus,
    });
  } else {
    await DigitalPass.findOneAndUpdate(
      { registrationId: registration._id },
      { verificationStatus: restoredVerificationStatus }
    );
  }

  await logActivity({
    actorType: 'admin',
    actorId: adminId,
    userId: registration.userId,
    registrationId: registration._id,
    action: 'registration.restored',
  });

  await logAudit({
    entityType: 'Registration',
    entityId: registration._id,
    action: 'status_changed',
    performedBy: adminId,
    beforeState,
    afterState: { registrationStatus: restoredStatus },
  });

  await createNotification({
    userId: registration.userId,
    registrationId: registration._id,
    type: 'registration_restored',
    title: 'Registration restored',
    message: 'Your registration has been restored.',
  });

  return registration;
};

export const deleteRegistrationCascade = async (id, adminId) => {
  const registration = await Registration.findById(id);
  if (!registration) {
    throw ApiError.notFound('Registration not found');
  }

  const detail = await assembleRegistrationDetail(registration);
  const snapshot = { registration: registration.toObject(), ...detail };

  await documentService.deleteAllDocuments(registration);

  await Promise.all([
    PersonalInformation.deleteOne({ registrationId: registration._id }),
    EmergencyContact.deleteOne({ registrationId: registration._id }),
    MedicalProfile.deleteOne({ registrationId: registration._id }),
    TravelInformation.deleteOne({ registrationId: registration._id }),
    Accommodation.deleteOne({ registrationId: registration._id }),
    FamilyMember.deleteMany({ registrationId: registration._id }),
    registration.digitalPassId
      ? DigitalPass.deleteOne({ _id: registration.digitalPassId })
      : Promise.resolve(),
  ]);

  await registration.deleteOne();

  await logAudit({
    entityType: 'Registration',
    entityId: id,
    action: 'deleted',
    performedBy: adminId,
    beforeState: snapshot,
    afterState: null,
  });

  await logActivity({
    actorType: 'admin',
    actorId: adminId,
    userId: registration.userId,
    registrationId: registration._id,
    action: 'registration.deleted',
  });

  return { deleted: true };
};

export const listRegistrations = async (query) => {
  const { page, limit, skip } = getPagination(query);
  const sortableFields = ['createdAt', 'submittedAt', 'registrationNumber', 'completionPercentage'];
  const sortField = sortableFields.includes(query.sortBy) ? query.sortBy : 'createdAt';
  const sortOrder = query.sortOrder === 'asc' ? 1 : -1;

  const match = {};
  if (query.eventId) match.eventId = new mongoose.Types.ObjectId(query.eventId);
  // The admin Registrations page (and Pending Approvals, which layers its
  // own status=submitted on top of this) never shows drafts — a draft is a
  // registration nobody has actually submitted yet, so it has no business
  // appearing in a list of pilgrims. Explicitly requesting status=draft
  // (e.g. a hand-crafted URL) is deliberately ignored rather than honored,
  // same as any other status falls back to "everything except draft".
  if (query.status && query.status !== REGISTRATION_STATUS.DRAFT) {
    match.registrationStatus = query.status;
  } else {
    match.registrationStatus = { $ne: REGISTRATION_STATUS.DRAFT };
  }
  if (query.dateFrom || query.dateTo) {
    match.submittedAt = {};
    if (query.dateFrom) match.submittedAt.$gte = new Date(query.dateFrom);
    if (query.dateTo) match.submittedAt.$lte = new Date(query.dateTo);
  }
  // Search (registrationNumber/pilgrimId/name/mobile) is applied in one
  // place only — the personalFilters $match below, after the
  // PersonalInformation lookup — since it needs name/mobile alongside the
  // root fields. Splitting it across two AND'd $match stages would require
  // both to match simultaneously, breaking name-only searches.

  const pipeline = [
    { $match: match },
    {
      $lookup: {
        from: PersonalInformation.collection.name,
        localField: '_id',
        foreignField: 'registrationId',
        as: 'personal',
      },
    },
    { $unwind: { path: '$personal', preserveNullAndEmptyArrays: true } },
  ];

  // Fields that live inside PersonalInformation.data need their own $match
  // stage after the $lookup/$unwind above — they can't be part of the
  // initial $match since that runs before the join.
  const personalFilters = {};
  if (query.gender) personalFilters['personal.data.gender'] = query.gender;
  if (query.state) personalFilters['personal.data.state'] = query.state;
  if (query.district) personalFilters['personal.data.district'] = query.district;
  if (query.search) {
    const regex = new RegExp(escapeRegExp(query.search), 'i');
    personalFilters.$or = [
      { registrationNumber: regex },
      { pilgrimId: regex },
      { 'personal.data.fullName': regex },
      { 'personal.data.mobile': regex },
    ];
  }
  if (Object.keys(personalFilters).length > 0) {
    pipeline.push({ $match: personalFilters });
  }

  pipeline.push(
    { $sort: { [sortField]: sortOrder } },
    {
      $facet: {
        data: [{ $skip: skip }, { $limit: limit }],
        totalCount: [{ $count: 'count' }],
      },
    }
  );

  const [result] = await Registration.aggregate(pipeline);
  const total = result.totalCount[0]?.count ?? 0;

  const registrations = await Registration.populate(result.data, [
    { path: 'eventId', select: 'name status startDate endDate' },
    { path: 'qrId', select: 'status' },
  ]);

  return { registrations, meta: buildPaginationMeta({ page, limit, total }) };
};

// Admin detail view (Registration Details page). Reuses the same
// collections as the citizen wizard (assembleRegistrationDetail,
// documentService, auditLog.service) — nothing here is a new model, just a
// single assembled response so the page doesn't need four separate round
// trips for data that's already sitting in existing collections.
export const getRegistrationById = async (id) => {
  const registration = await Registration.findById(id)
    .populate('eventId')
    .populate('qrId')
    .populate('reviewedBy', 'name email');

  if (!registration) {
    throw ApiError.notFound('Registration not found');
  }

  // Same rule as listRegistrations: a draft is unsubmitted, half-filled
  // data that has no business appearing in the admin Registration section —
  // block direct access by id too, not just the list, so there's no path
  // (e.g. a guessed/typed URL) into a draft's detail view.
  if (registration.registrationStatus === REGISTRATION_STATUS.DRAFT) {
    throw ApiError.notFound('Registration not found');
  }

  const [
    { personalInformation, emergencyContact, medicalProfile, travelInformation, accommodation, familyMembers, digitalPass },
    documents,
    auditLogs,
  ] = await Promise.all([
    assembleRegistrationDetail(registration),
    documentService.listDocuments(registration),
    listAuditLogs('Registration', registration._id),
  ]);

  // Admin sees the real QR unconditionally (assembleRegistrationDetail
  // never redacts it — only getDraft does, for the citizen). passActivated
  // is still computed here so the admin's Verification badge reflects the
  // true on-site-verification state rather than always reading "Verified"
  // (which is all DigitalPass.status alone could ever say, since that
  // field is set to 'active' at submit and never changes after).
  const passActivated = await isPassActivated(digitalPass?._id);
  const verificationStatus = getEffectiveVerificationStatus(digitalPass, registration.registrationStatus);

  return {
    registration,
    event: registration.eventId,
    qr: registration.qrId,
    personal: personalInformation,
    // Address fields live inside the personal-information step's own
    // `data` blob — there is no separate Address collection, so this is
    // the same document exposed under the name the Address tab binds to.
    address: personalInformation,
    emergencyContact,
    medicalInformation: medicalProfile,
    travelInformation,
    accommodation,
    familyMembers,
    documents,
    auditLogs,
    digitalPass: digitalPass && {
      ...digitalPass.toObject(),
      verificationStatus,
      passActivated,
    },
  };
};

export const getPassByCode = async (code) => {
  const cleanCode = (code || '').trim();
  console.log('[PUBLIC PASS LOOKUP DEBUG] Incoming code:', cleanCode);

  if (!cleanCode) {
    throw ApiError.badRequest('Pass code or registration number is required');
  }

  const isMongoId = mongoose.Types.ObjectId.isValid(cleanCode);
  const upperCode = cleanCode.toUpperCase();

  // 1. Try finding DigitalPass directly by qrCode or _id
  let digitalPassDoc = await DigitalPass.findOne({
    $or: [{ qrCode: cleanCode }, ...(isMongoId ? [{ _id: cleanCode }] : [])],
  });

  let registration = null;
  if (digitalPassDoc) {
    registration = await Registration.findById(digitalPassDoc.registrationId);
  } else {
    // 2. Try finding Registration by registrationNumber, pilgrimId, _id, or userId
    const regConditions = [
      { registrationNumber: upperCode },
      { pilgrimId: upperCode },
    ];
    if (isMongoId) {
      regConditions.push({ _id: cleanCode });
      regConditions.push({ userId: cleanCode });
    }
    registration = await Registration.findOne({ $or: regConditions }).sort({ createdAt: -1 });
    if (registration) {
      digitalPassDoc = await DigitalPass.findOne({ registrationId: registration._id });
    }
  }

  console.log(
    '[PUBLIC PASS LOOKUP DEBUG] Result:',
    registration ? `Found Registration ${registration._id}` : 'NONE'
  );

  if (!registration) {
    console.log('[PUBLIC PASS LOOKUP DEBUG] Failure reason: Code', cleanCode, 'did not match any DigitalPass or Registration');
    throw ApiError.notFound('No registration or digital pass found for this code');
  }

  const detail = await assembleRegistrationDetail(registration);
  const passActivated = await isPassActivated(digitalPassDoc?._id);
  const verificationStatus = getEffectiveVerificationStatus(digitalPassDoc, registration.registrationStatus);

  const formattedPass = {
    ...(digitalPassDoc ? digitalPassDoc.toObject() : {}),
    passNumber: digitalPassDoc?.passNumber || registration.registrationNumber,
    verificationStatus,
    qrCode: passActivated ? digitalPassDoc?.qrCode : null,
    qrImage: passActivated ? digitalPassDoc?.qrImage : null,
    passActivated,
  };

  return {
    registrationId: registration._id,
    registrationStatus: registration.registrationStatus,
    registrationNumber: registration.registrationNumber,
    rejectionReason: registration.rejectionReason || registration.statusNote,
    personalInformation: detail.personalInformation,
    accommodation: detail.accommodation,
    digitalPass: formattedPass,
    event: detail.event,
  };
};

export default {
  startRegistration,
  assembleRegistrationDetail,
  savePersonalInformation,
  saveEmergencyContact,
  saveMedicalInformation,
  saveTravelInformation,
  saveAccommodation,
  saveFamilyMembers,
  addFamilyMember,
  updateFamilyMember,
  deleteFamilyMember,
  listFamilyMembers,
  getDraft,
  getPassByCode,
  submitRegistration,
  approveRegistration,
  rejectRegistration,
  requestMoreInfo,
  suspendRegistration,
  restoreRegistration,
  deleteRegistrationCascade,
  listRegistrations,
  getRegistrationById,
  listActivity,
};