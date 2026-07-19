import { DigitalPass } from '../models/digitalPass.model.js';
import { Registration } from '../models/registration.model.js';
import { ScanLog } from '../models/scanLog.model.js';
import { MedicalProfile } from '../models/medicalProfile.model.js';
import { EmergencyContact } from '../models/emergencyContact.model.js';
import { User } from '../models/user.model.js';
import { ApiError } from '../utils/ApiError.js';
import { parseUserAgent } from '../utils/parseUserAgent.js';
import { getPagination, buildPaginationMeta } from '../helpers/pagination.helper.js';
import { assembleRegistrationDetail } from './registration.service.js';
import { logActivity } from './activityLog.service.js';

const startOfToday = () => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  return date;
};

// "Scan QR" and "Manual Code Entry" both land here — a pass's own qrCode is
// tried first, falling back to a typed registrationNumber/pilgrimId (the
// operator may only have the printed pass, not a scannable code), and
// finally the pilgrim's own account email/mobile — the event-day flow for
// a logged-in pilgrim: the operator looks them up by whatever identifier
// they give at the gate, not just a scannable code.
export const verifyPass = async (code) => {
  let digitalPass = await DigitalPass.findOne({ qrCode: code });

  if (!digitalPass) {
    let matchedRegistration = await Registration.findOne({
      $or: [{ registrationNumber: code }, { pilgrimId: code }],
    });

    if (!matchedRegistration) {
      const matchedUser = await User.findOne({ $or: [{ email: code.toLowerCase() }, { mobile: code }] });
      if (matchedUser) {
        matchedRegistration = await Registration.findOne({ userId: matchedUser._id }).sort({
          createdAt: -1,
        });
      }
    }

    if (matchedRegistration?.digitalPassId) {
      digitalPass = await DigitalPass.findById(matchedRegistration.digitalPassId);
    }
  }

  if (!digitalPass) {
    throw ApiError.notFound('No digital pass found for this code');
  }

  const registration = await Registration.findById(digitalPass.registrationId).populate(
    'eventId',
    'name'
  );

  if (!registration) {
    throw ApiError.notFound('Registration not found for this pass');
  }

  const detail = await assembleRegistrationDetail(registration);

  const alreadyCheckedInToday = await ScanLog.exists({
    digitalPassId: digitalPass._id,
    result: 'approved',
    createdAt: { $gte: startOfToday() },
  });

  return {
    digitalPass,
    registration,
    alreadyCheckedInToday: Boolean(alreadyCheckedInToday),
    ...detail,
  };
};

// The operator's explicit Approve/Reject decision — duplicate entries are
// flagged (wasDuplicate), never hard-blocked (see plan notes).
export const logScan = async ({ digitalPassId, operatorId, result, reason, userAgent, ipAddress }) => {
  const digitalPass = await DigitalPass.findById(digitalPassId);
  if (!digitalPass) {
    throw ApiError.notFound('Digital pass not found');
  }

  const wasDuplicate = Boolean(
    await ScanLog.exists({
      digitalPassId,
      result: 'approved',
      createdAt: { $gte: startOfToday() },
    })
  );

  const { device, browser } = parseUserAgent(userAgent);

  const scanLog = await ScanLog.create({
    digitalPassId,
    registrationId: digitalPass.registrationId,
    operatorId,
    result,
    reason: reason || null,
    wasDuplicate,
    device,
    browser,
    ipAddress,
  });

  await logActivity({
    actorType: 'admin',
    actorId: operatorId,
    userId: digitalPass.userId,
    registrationId: digitalPass.registrationId,
    action: result === 'approved' ? 'operator.entry_approved' : 'operator.entry_rejected',
    metadata: { reason, wasDuplicate },
  });

  return scanLog;
};

export const listScanHistory = async (query) => {
  const { page, limit, skip } = getPagination(query);
  const filter = {};

  if (query.result) filter.result = query.result;
  if (query.dateFrom || query.dateTo) {
    filter.createdAt = {};
    if (query.dateFrom) filter.createdAt.$gte = new Date(query.dateFrom);
    if (query.dateTo) filter.createdAt.$lte = new Date(query.dateTo);
  }

  const [scans, total] = await Promise.all([
    ScanLog.find(filter)
      .populate('operatorId', 'name email')
      .populate('registrationId', 'registrationNumber pilgrimId')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
    ScanLog.countDocuments(filter),
  ]);

  return { scans, meta: buildPaginationMeta({ page, limit, total }) };
};

export const getOperatorDashboard = async () => {
  const todayFilter = { createdAt: { $gte: startOfToday() } };

  const [todayEntries, rejectedEntries, duplicateAttempts, approvedTodayLogs] = await Promise.all([
    ScanLog.countDocuments({ ...todayFilter, result: 'approved' }),
    ScanLog.countDocuments({ ...todayFilter, result: 'rejected' }),
    ScanLog.countDocuments({ ...todayFilter, wasDuplicate: true }),
    ScanLog.find({ ...todayFilter, result: 'approved' }).select('registrationId'),
  ]);

  const registrationIds = approvedTodayLogs.map((log) => log.registrationId);

  const [medicalAlerts, emergencyContacts] = await Promise.all([
    MedicalProfile.find({
      registrationId: { $in: registrationIds },
      $or: [{ 'data.medicalConditions': { $nin: [null, ''] } }, { 'data.allergies': { $nin: [null, ''] } }],
    }).select('registrationId data'),
    EmergencyContact.find({ registrationId: { $in: registrationIds } }).select('registrationId data'),
  ]);

  return {
    todayEntries,
    rejectedEntries,
    duplicateAttempts,
    medicalAlerts: medicalAlerts.map((entry) => ({
      registrationId: entry.registrationId,
      conditions: entry.data?.medicalConditions || null,
      allergies: entry.data?.allergies || null,
    })),
    emergencyContacts: emergencyContacts.map((entry) => ({
      registrationId: entry.registrationId,
      contactName: entry.data?.contactName || null,
      phone: entry.data?.phone || null,
    })),
  };
};

export default { verifyPass, logScan, listScanHistory, getOperatorDashboard };
