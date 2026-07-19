import { adminApiClient } from './adminApiClient';

export const listRegistrations = (params) => adminApiClient.get('/registration', { params });

export const getRegistration = (id) => adminApiClient.get(`/registration/${id}`);

// Each of these three wraps its list in a named key inside the standard
// envelope (`{ audit }` / `{ documents }` / `{ activity }`, see
// registration.controller.js) — adminApiClient's interceptor only unwraps
// the outer envelope, so unwrap the named key here too rather than leaving
// every caller to guess whether `data` is the array or `{ key: [...] }`.
export const getRegistrationAudit = (id) =>
  adminApiClient.get(`/registration/${id}/audit`).then((res) => res.audit);

export const getRegistrationDocuments = (id) =>
  adminApiClient.get(`/registration/${id}/documents`).then((res) => res.documents);

export const getRegistrationActivity = (id) =>
  adminApiClient.get(`/registration/${id}/activity`).then((res) => res.activity);

export const approveRegistration = (id) => adminApiClient.put(`/registration/${id}/approve`);

export const rejectRegistration = (id, reason) =>
  adminApiClient.put(`/registration/${id}/reject`, { reason });

export const requestMoreInfo = (id, reason) =>
  adminApiClient.put(`/registration/${id}/request-info`, { reason });

export const suspendRegistration = (id, reason) =>
  adminApiClient.put(`/registration/${id}/suspend`, { reason });

export const restoreRegistration = (id) => adminApiClient.put(`/registration/${id}/restore`);

export const deleteRegistration = (id) => adminApiClient.delete(`/registration/${id}`);

export default {
  listRegistrations,
  getRegistration,
  getRegistrationAudit,
  getRegistrationDocuments,
  getRegistrationActivity,
  approveRegistration,
  rejectRegistration,
  requestMoreInfo,
  suspendRegistration,
  restoreRegistration,
  deleteRegistration,
};
