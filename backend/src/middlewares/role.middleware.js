import { ApiError } from '../utils/ApiError.js';

export const restrictTo = (...allowedRoles) => (req, _res, next) => {
  if (!req.admin) {
    throw ApiError.unauthorized('Authentication required');
  }

  if (!allowedRoles.includes(req.admin.role)) {
    throw ApiError.forbidden('You do not have permission to perform this action');
  }

  next();
};

export default restrictTo;
