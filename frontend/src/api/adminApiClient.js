import axios from 'axios';
import { useAdminAuthStore } from '@/store/useAdminAuthStore';
import { ApiError } from './axiosClient';

const baseURL =
  import.meta.env.VITE_API_URL ||
  import.meta.env.VITE_API_BASE_URL ||
  'http://localhost:5000/api/v1';

// Separate instance from the citizen axiosClient (see increment 6 plan
// notes): admin auth has a real access+refresh cycle via an httpOnly
// cookie (backend/src/controllers/auth.controller.js), which the citizen
// draft-token client deliberately doesn't implement. withCredentials is
// required for that cookie to be sent/received cross-origin.
export const adminApiClient = axios.create({ baseURL, timeout: 15000, withCredentials: true });

adminApiClient.interceptors.request.use((config) => {
  const { accessToken } = useAdminAuthStore.getState();
  if (accessToken) {
    config.headers.Authorization = `Bearer ${accessToken}`;
  }
  return config;
});

// Dedupes concurrent refresh attempts if several requests 401 at once.
let refreshPromise = null;

const refreshAccessToken = async () => {
  // Plain axios, not adminApiClient — avoids recursively triggering these
  // same interceptors during the refresh call itself.
  const response = await axios.post(`${baseURL}/auth/refresh`, {}, { withCredentials: true });
  return response.data.data;
};

adminApiClient.interceptors.response.use(
  (response) => response.data?.data,
  async (error) => {
    const originalRequest = error.config;
    const status = error.response?.status;
    const payload = error.response?.data;
    const isAuthEndpoint = originalRequest?.url?.includes('/auth/');

    if (status === 401 && originalRequest && !originalRequest._retry && !isAuthEndpoint) {
      originalRequest._retry = true;
      try {
        refreshPromise = refreshPromise || refreshAccessToken();
        const { admin, accessToken } = await refreshPromise;
        refreshPromise = null;
        useAdminAuthStore.getState().setSession({ accessToken, admin });
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return adminApiClient(originalRequest);
      } catch {
        refreshPromise = null;
        useAdminAuthStore.getState().clearSession();
      }
    }

    const message = payload?.message || error.message || 'Something went wrong';
    const errors = payload?.errors || [];
    return Promise.reject(new ApiError(message, { status, errors }));
  }
);

export default adminApiClient;
