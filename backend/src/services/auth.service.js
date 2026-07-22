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

export const updateProfile = async (adminId, { name, email }) => {
  const normalizedEmail = email.trim().toLowerCase();

  const conflict = await Admin.findOne({ email: normalizedEmail, _id: { $ne: adminId } });
  if (conflict) {
    throw ApiError.conflict('This email is already in use', [
      { field: 'email', message: 'Email already in use' },
    ]);
  }

  const admin = await Admin.findById(adminId);
  if (!admin) {
    throw ApiError.notFound('Admin not found');
  }

  admin.name = name;
  admin.email = normalizedEmail;
  await admin.save();

  return admin.toSafeObject();
};

export const changePassword = async (adminId, { currentPassword, newPassword }) => {
  const admin = await Admin.findById(adminId).select('+password');
  if (!admin) {
    throw ApiError.notFound('Admin not found');
  }

  const isMatch = await admin.comparePassword(currentPassword);
  if (!isMatch) {
    throw ApiError.badRequest('Current password is incorrect', [
      { field: 'currentPassword', message: 'Incorrect password' },
    ]);
  }

  admin.password = newPassword; // hashed by the model's pre-save hook
  await admin.save();
};

export default { login, refreshAccessToken, logout, updateProfile, changePassword };
