import bcrypt from 'bcrypt';
import { Admin } from '../models/admin.model.js';
import { ApiError } from '../utils/ApiError.js';
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
} from '../helpers/token.helper.js';

const issueTokens = async (admin) => {
  const accessToken = signAccessToken({ sub: admin._id.toString(), role: admin.role });
  const refreshToken = signRefreshToken({ sub: admin._id.toString() });

  admin.refreshTokenHash = await bcrypt.hash(refreshToken, 10);
  admin.lastLogin = new Date();
  await admin.save();

  return { accessToken, refreshToken };
};

export const login = async ({ email, password }) => {
  const admin = await Admin.findOne({ email }).select('+password +refreshTokenHash');

  if (!admin || !admin.isActive) {
    throw ApiError.unauthorized('Invalid credentials');
  }

  const isMatch = await admin.comparePassword(password);
  if (!isMatch) {
    throw ApiError.unauthorized('Invalid credentials');
  }

  const tokens = await issueTokens(admin);

  return { admin: admin.toSafeObject(), ...tokens };
};

export const refreshAccessToken = async (refreshToken) => {
  if (!refreshToken) {
    throw ApiError.unauthorized('Refresh token missing');
  }

  let decoded;
  try {
    decoded = verifyRefreshToken(refreshToken);
  } catch (err) {
    throw ApiError.unauthorized('Invalid or expired refresh token');
  }

  const admin = await Admin.findById(decoded.sub).select('+refreshTokenHash');

  if (!admin || !admin.isActive || !admin.refreshTokenHash) {
    throw ApiError.unauthorized('Refresh token no longer valid');
  }

  const isMatch = await bcrypt.compare(refreshToken, admin.refreshTokenHash);
  if (!isMatch) {
    throw ApiError.unauthorized('Refresh token no longer valid');
  }

  const tokens = await issueTokens(admin);

  return { admin: admin.toSafeObject(), ...tokens };
};

export const logout = async (adminId) => {
  await Admin.findByIdAndUpdate(adminId, { refreshTokenHash: null });
};

export default { login, refreshAccessToken, logout };
