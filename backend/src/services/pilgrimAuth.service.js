import { User } from '../models/user.model.js';
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
  user.password = password; // hashed by the model's pre-save hook
  await user.save();

  return user.toSafeObject();
};

export const login = async ({ email, password }) => {
  const user = await User.findOne({ email: email.trim().toLowerCase() }).select('+password');

  if (!user || !user.password || !user.isActive) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    throw ApiError.unauthorized('Invalid email or password');
  }

  const accessToken = signPilgrimToken({ sub: user._id.toString() });

  return { user: user.toSafeObject(), accessToken };
};

export default { setCredentials, login };
