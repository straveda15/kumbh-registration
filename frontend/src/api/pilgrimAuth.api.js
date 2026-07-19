import { axiosClient } from './axiosClient';

// Completely separate from adminAuth.api.js — different backend route
// (/api/v1/pilgrim, not /api/v1/auth), different token, and it rides the
// citizen axiosClient (draft-token client), not adminApiClient.
export const login = (credentials) => axiosClient.post('/pilgrim/login', credentials);

export default { login };
