import { verifyAccessToken } from '../helpers/token.helper.js';
import { Admin } from '../models/admin.model.js';
import { ApiError } from '../utils/ApiError.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const protect = asyncHandler(async (req, _res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;

  if (!token) {
    throw ApiError.unauthorized('Authentication token missing');
  }

  let decoded;
  try {
    decoded = verifyAccessToken(token);
  } catch (err) {
    throw ApiError.unauthorized('Invalid or expired token');
  }

  const admin = await Admin.findById(decoded.sub);

  if (!admin || !admin.isActive) {
    throw ApiError.unauthorized('Account no longer active');
  }

  req.admin = admin;
  next();
});

export default protect;
