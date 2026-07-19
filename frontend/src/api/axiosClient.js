import axios from 'axios';
import { useDraftSessionStore } from '@/store/useDraftSessionStore';
import { usePilgrimAuthStore } from '@/store/usePilgrimAuthStore';

const baseURL =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost:5000/api/v1';

export class ApiError extends Error {
  constructor(message, { status, errors = [] } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.errors = errors;
  }
}

export const axiosClient = axios.create({ baseURL, timeout: 15000 });

// Two citizen-facing token types can authorize the same requests (see
// backend/src/middlewares/draftAuth.middleware.js): the anonymous draft
// token issued at /registration/start, and a logged-in pilgrim's own
// access token from /pilgrim/login. A pilgrim token wins when both exist —
// it represents a real, explicit login, so it should take priority over a
// leftover/stale draft token sitting in the same browser.
axiosClient.interceptors.request.use((config) => {
  const { accessToken: pilgrimToken } = usePilgrimAuthStore.getState();
  const { draftToken } = useDraftSessionStore.getState();
  const token = pilgrimToken || draftToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Unwraps the backend's standard {success, message, data} / {success,
// message, errors} envelope (see backend/src/utils/ApiResponse.js and
// ApiError.js) so callers just get the inner data, or a normalized ApiError.
axiosClient.interceptors.response.use(
  (response) => response.data?.data,
  (error) => {
    const status = error.response?.status;
    const payload = error.response?.data;

    if (status === 401) {
      // No refresh endpoint for either citizen token type, so the honest
      // behavior is to drop whichever stale session caused the 401 rather
      // than pretend to silently refresh it. Clearing both is safe even
      // when only one was actually in use.
      usePilgrimAuthStore.getState().clearSession();
      useDraftSessionStore.getState().clearSession();
    }

    const message = payload?.message || error.message || 'Something went wrong';
    const errors = payload?.errors || [];

    return Promise.reject(new ApiError(message, { status, errors }));
  }
);

export default axiosClient;
