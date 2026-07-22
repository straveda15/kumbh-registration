import { adminApiClient } from './adminApiClient';

export const login = (credentials) => adminApiClient.post('/auth/login', credentials);

export const logout = () => adminApiClient.post('/auth/logout');

// Backend wraps this as `{ admin }` (see auth.controller.js's getProfile) —
// unwrap here so callers get the bare Admin object, not `{ admin: {...} }`.
export const getProfile = () => adminApiClient.get('/auth/me').then((res) => res.admin);

export const updateProfile = (payload) =>
  adminApiClient.put('/auth/me', payload).then((res) => res.admin);

export const changePassword = (payload) => adminApiClient.put('/auth/me/password', payload);

export default { login, logout, getProfile, updateProfile, changePassword };
