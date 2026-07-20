import * as authService from '../services/auth.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import config from '../config/env.js';

const REFRESH_COOKIE_NAME = 'refreshToken';

const refreshCookieOptions = {
  httpOnly: true,
  secure: config.isProduction,
  // 'strict' would never be sent on the cross-site XHR calls the frontend
  // makes to a separately-hosted backend (different Vercel domain) — only
  // 'none' is sent cross-site, and browsers require 'secure: true'
  // alongside it, which is already the case here in production.
  sameSite: config.isProduction ? 'none' : 'lax',
  path: '/api/v1/auth',
  maxAge: 7 * 24 * 60 * 60 * 1000,
};

export const login = asyncHandler(async (req, res) => {
  const { admin, accessToken, refreshToken } = await authService.login(req.body);

  res.cookie(REFRESH_COOKIE_NAME, refreshToken, refreshCookieOptions);

  return new ApiResponse(200, { admin, accessToken }, 'Login successful').send(res);
});

export const refresh = asyncHandler(async (req, res) => {
  const tokenFromCookie = req.cookies?.[REFRESH_COOKIE_NAME];
  const tokenFromBody = req.body?.refreshToken;

  const { admin, accessToken, refreshToken } = await authService.refreshAccessToken(
    tokenFromCookie || tokenFromBody
  );

  res.cookie(REFRESH_COOKIE_NAME, refreshToken, refreshCookieOptions);

  return new ApiResponse(200, { admin, accessToken }, 'Token refreshed').send(res);
});

export const logout = asyncHandler(async (req, res) => {
  await authService.logout(req.admin._id);

  res.clearCookie(REFRESH_COOKIE_NAME, { path: '/api/v1/auth' });

  return new ApiResponse(200, {}, 'Logged out successfully').send(res);
});

export const getProfile = asyncHandler(async (req, res) => {
  return new ApiResponse(200, { admin: req.admin.toSafeObject() }, 'Profile fetched').send(res);
});

export default { login, refresh, logout, getProfile };
