import { axiosClient } from './axiosClient';

// One function per backend endpoint, named 1:1 with
// backend/src/routes/registration.routes.js. Thin — no business logic here,
// that lives in features/registration-wizard/hooks.

export const startRegistration = (code) =>
  axiosClient.post('/registration/start', { code });

export const getDraft = () => axiosClient.get('/registration/draft');

// Kept separate from savePersonalInformation — sends only
// fullName/email/mobile/password/confirmPassword to the dedicated
// credentials endpoint, never through the generic step-data payload (see
// backend/src/controllers/registration.controller.js's
// saveAccountCredentials for why).
export const saveAccountCredentials = (payload) =>
  axiosClient.put('/registration/account', payload).then((res) => res.user);

export const savePersonalInformation = (payload) =>
  axiosClient.put('/registration/personal', payload);

export const saveEmergencyContact = (payload) =>
  axiosClient.put('/registration/emergency', payload);

export const saveMedicalInformation = (payload) =>
  axiosClient.put('/registration/medical', payload);

export const saveTravelInformation = (payload) =>
  axiosClient.put('/registration/travel', payload);

export const saveAccommodation = (payload) =>
  axiosClient.put('/registration/accommodation', payload);

export const saveFamilyMembers = (members) =>
  axiosClient.put('/registration/family', { members });

// Backend wraps this one in a named key (`{ members }`, see
// registration.controller.js's listFamilyMembers) inside the standard
// envelope — unwrap it here so callers get FamilyMember[] directly.
export const listFamilyMembers = () =>
  axiosClient.get('/registration/family').then((res) => res.members);

export const addFamilyMember = (payload) =>
  axiosClient.post('/registration/family/member', payload);

export const updateFamilyMember = (id, payload) =>
  axiosClient.put(`/registration/family/member/${id}`, payload);

export const deleteFamilyMember = (id) =>
  axiosClient.delete(`/registration/family/member/${id}`);

export const submitRegistration = () => axiosClient.post('/registration/submit');

// Same named-key wrapping as listFamilyMembers above (`{ activity }`, see
// registration.controller.js's getActivity) — unwrap so ActivityTimelineCard
// always receives Activity[], never `{ activity: [...] }`.
export const getActivity = () => axiosClient.get('/registration/activity').then((res) => res.activity);

export default {
  startRegistration,
  getDraft,
  getActivity,
  saveAccountCredentials,
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
};
