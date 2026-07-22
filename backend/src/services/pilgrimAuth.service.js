import { User } from '../models/user.model.js';
import { Registration } from '../models/registration.model.js';
import { ApiError } from '../utils/ApiError.js';
import { signPilgrimToken } from '../helpers/token.helper.js';

// Called from the Personal Information step (registration.controller.js's
// saveAccountCredentials) — sets the credentials that turn an otherwise
// anonymous registration into a real, later-loggable-into pilgrim account.
// Uniqueness is checked here (not just via the Mongo unique index) so a
// re-save of the pilgrim's own unchanged email/mobile — which happens on
// every step autosave — doesn't false-positive against itself.
export const setCredentials = async (userId, { fullName, email, mobile, password }) => {
  const normalizedEmail = email.trim().toLowerCase();

  const [emailConflict, mobileConflict] = await Promise.all([
    User.findOne({ email: normalizedEmail, _id: { $ne: userId } }),
    User.findOne({ mobile, _id: { $ne: userId } }),
  ]);

  if (emailConflict) {
    throw ApiError.conflict('This email is already registered to another account', [
      { field: 'email', message: 'Email already in use' },
    ]);
  }

  if (mobileConflict) {
    throw ApiError.conflict('This mobile number is already registered to another account', [
      { field: 'mobile', message: 'Mobile number already in use' },
    ]);
  }

  const user = await User.findById(userId);
  if (!user) {
    throw ApiError.notFound('User not found');
  }

  user.fullName = fullName;
  user.email = normalizedEmail;
  user.mobile = mobile;
  // Only set on first-time account creation (wizard) — the Profile page's
  // Edit Profile form never sends one, and changing an existing password
  // goes through changePassword below instead, which requires the current
  // one.
  if (password) {
    user.password = password; // hashed by the model's pre-save hook
  }
  await user.save();

  return user.toSafeObject();
};

export const changePassword = async (userId, { currentPassword, newPassword }) => {
  const user = await User.findById(userId).select('+password');
  if (!user) {
    throw ApiError.notFound('User not found');
  }
  if (!user.password) {
    throw ApiError.badRequest('No password is set on this account yet');
  }

  const isMatch = await user.comparePassword(currentPassword);
  if (!isMatch) {
    throw ApiError.badRequest('Current password is incorrect', [
      { field: 'currentPassword', message: 'Incorrect password' },
    ]);
  }

  user.password = newPassword; // hashed by the model's pre-save hook
  await user.save();
};

// Looked up via Registration (registrationNumber only exists post-submit —
// see registration.service.js's submitRegistration) rather than directly
// on User, since registrationNumber lives on the Registration document, one
// hop away via userId.
export const login = async ({ registrationNumber, password }) => {
  const registration = await Registration.findOne({
    registrationNumber: registrationNumber.trim().toUpperCase(),
  });
  const user = registration ? await User.findById(registration.userId).select('+password') : null;

  if (!user || !user.password || !user.isActive) {
    throw ApiError.unauthorized('Invalid registration number or password');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw ApiError.unauthorized('Invalid registration number or password');
  }

  const accessToken = signPilgrimToken({ sub: user._id.toString() });

  return { user: user.toSafeObject(), accessToken };
};

export default { setCredentials, changePassword, login };
