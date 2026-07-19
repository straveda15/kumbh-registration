import * as registrationService from '../services/registration.service.js';
import * as documentService from '../services/document.service.js';
import * as pilgrimAuthService from '../services/pilgrimAuth.service.js';
import { listAuditLogs } from '../services/auditLog.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';

const requestMeta = (req) => ({ ipAddress: req.ip, userAgent: req.get('user-agent') });

// Public entry point: a citizen starts the wizard right after scanning a QR.
export const startRegistration = asyncHandler(async (req, res) => {
  const progress = await registrationService.startRegistration(req.body, requestMeta(req));
  return new ApiResponse(201, progress, 'Registration draft started').send(res);
});

export const getDraft = asyncHandler(async (req, res) => {
  const draft = await registrationService.getDraft(req.draft.registration);
  return new ApiResponse(200, draft, 'Draft fetched successfully').send(res);
});

// Sets the pilgrim's login credentials (email/mobile/password) — kept
// separate from savePersonalInformation below so a plaintext password
// never passes through the generic stepDataSchema/PersonalInformation.data
// path (see pilgrimAuth.service.js's setCredentials).
export const saveAccountCredentials = asyncHandler(async (req, res) => {
  const user = await pilgrimAuthService.setCredentials(req.draft.userId, req.body);
  return new ApiResponse(200, { user }, 'Account credentials saved').send(res);
});

export const savePersonalInformation = asyncHandler(async (req, res) => {
  const progress = await registrationService.savePersonalInformation(
    req.draft.registration,
    req.body,
    requestMeta(req)
  );
  return new ApiResponse(200, progress, 'Personal information saved').send(res);
});

export const saveEmergencyContact = asyncHandler(async (req, res) => {
  const progress = await registrationService.saveEmergencyContact(
    req.draft.registration,
    req.body,
    requestMeta(req)
  );
  return new ApiResponse(200, progress, 'Emergency contact saved').send(res);
});

export const saveMedicalInformation = asyncHandler(async (req, res) => {
  const progress = await registrationService.saveMedicalInformation(
    req.draft.registration,
    req.body,
    requestMeta(req)
  );
  return new ApiResponse(200, progress, 'Medical information saved').send(res);
});

export const saveTravelInformation = asyncHandler(async (req, res) => {
  const progress = await registrationService.saveTravelInformation(
    req.draft.registration,
    req.body,
    requestMeta(req)
  );
  return new ApiResponse(200, progress, 'Travel information saved').send(res);
});

export const saveAccommodation = asyncHandler(async (req, res) => {
  const progress = await registrationService.saveAccommodation(
    req.draft.registration,
    req.body,
    requestMeta(req)
  );
  return new ApiResponse(200, progress, 'Accommodation details saved').send(res);
});

export const saveFamilyMembers = asyncHandler(async (req, res) => {
  const progress = await registrationService.saveFamilyMembers(
    req.draft.registration,
    req.body.members,
    requestMeta(req)
  );
  return new ApiResponse(200, progress, 'Family members saved').send(res);
});

export const listFamilyMembers = asyncHandler(async (req, res) => {
  const members = await registrationService.listFamilyMembers(req.draft.registration);
  return new ApiResponse(200, { members }, 'Family members fetched successfully').send(res);
});

export const addFamilyMember = asyncHandler(async (req, res) => {
  const result = await registrationService.addFamilyMember(
    req.draft.registration,
    req.body,
    requestMeta(req)
  );
  return new ApiResponse(201, result, 'Family member added').send(res);
});

export const updateFamilyMember = asyncHandler(async (req, res) => {
  const result = await registrationService.updateFamilyMember(
    req.draft.registration,
    req.params.id,
    req.body,
    requestMeta(req)
  );
  return new ApiResponse(200, result, 'Family member updated').send(res);
});

export const deleteFamilyMember = asyncHandler(async (req, res) => {
  const progress = await registrationService.deleteFamilyMember(
    req.draft.registration,
    req.params.id,
    requestMeta(req)
  );
  return new ApiResponse(200, progress, 'Family member removed').send(res);
});

export const getActivity = asyncHandler(async (req, res) => {
  const activity = await registrationService.listActivity(req.draft.registration);
  return new ApiResponse(200, { activity }, 'Activity fetched successfully').send(res);
});

export const submitRegistration = asyncHandler(async (req, res) => {
  const result = await registrationService.submitRegistration(req.draft.registration, requestMeta(req));
  return new ApiResponse(200, result, 'Registration submitted successfully').send(res);
});

export const listRegistrations = asyncHandler(async (req, res) => {
  const { registrations, meta } = await registrationService.listRegistrations(req.query);
  return new ApiResponse(200, { registrations, meta }, 'Registrations fetched successfully').send(
    res
  );
});

export const getRegistration = asyncHandler(async (req, res) => {
  const detail = await registrationService.getRegistrationById(req.params.id);
  return new ApiResponse(200, detail, 'Registration fetched successfully').send(res);
});

export const getRegistrationAudit = asyncHandler(async (req, res) => {
  const audit = await listAuditLogs('Registration', req.params.id);
  return new ApiResponse(200, { audit }, 'Audit history fetched successfully').send(res);
});

export const getRegistrationDocuments = asyncHandler(async (req, res) => {
  const documents = await documentService.listDocuments({ _id: req.params.id });
  return new ApiResponse(200, { documents }, 'Documents fetched successfully').send(res);
});

// Admin-scoped equivalent of getActivity (which is gated by the citizen's
// own draft/session token) — same registrationService.listActivity, just
// reached via admin auth + an :id param instead of req.draft.registration.
export const getRegistrationActivityAdmin = asyncHandler(async (req, res) => {
  const activity = await registrationService.listActivity({ _id: req.params.id });
  return new ApiResponse(200, { activity }, 'Activity fetched successfully').send(res);
});

export const approveRegistration = asyncHandler(async (req, res) => {
  const registration = await registrationService.approveRegistration(req.params.id, req.admin._id);
  return new ApiResponse(200, { registration }, 'Registration approved').send(res);
});

export const rejectRegistration = asyncHandler(async (req, res) => {
  const registration = await registrationService.rejectRegistration(
    req.params.id,
    req.admin._id,
    req.body.reason
  );
  return new ApiResponse(200, { registration }, 'Registration rejected').send(res);
});

export const requestMoreInfo = asyncHandler(async (req, res) => {
  const registration = await registrationService.requestMoreInfo(
    req.params.id,
    req.admin._id,
    req.body.reason
  );
  return new ApiResponse(200, { registration }, 'More information requested').send(res);
});

export const suspendRegistration = asyncHandler(async (req, res) => {
  const registration = await registrationService.suspendRegistration(
    req.params.id,
    req.admin._id,
    req.body.reason
  );
  return new ApiResponse(200, { registration }, 'Registration suspended').send(res);
});

export const restoreRegistration = asyncHandler(async (req, res) => {
  const registration = await registrationService.restoreRegistration(req.params.id, req.admin._id);
  return new ApiResponse(200, { registration }, 'Registration restored').send(res);
});

export const deleteRegistration = asyncHandler(async (req, res) => {
  await registrationService.deleteRegistrationCascade(req.params.id, req.admin._id);
  return new ApiResponse(200, {}, 'Registration deleted successfully').send(res);
});

export default {
  startRegistration,
  getDraft,
  getActivity,
  savePersonalInformation,
  saveEmergencyContact,
  saveMedicalInformation,
  saveTravelInformation,
  saveAccommodation,
  saveFamilyMembers,
  listFamilyMembers,
  addFamilyMember,
  updateFamilyMember,
  deleteFamilyMember,
  submitRegistration,
  listRegistrations,
  getRegistration,
  getRegistrationAudit,
  getRegistrationDocuments,
  getRegistrationActivityAdmin,
  approveRegistration,
  rejectRegistration,
  requestMoreInfo,
  suspendRegistration,
  restoreRegistration,
  deleteRegistration,
};
