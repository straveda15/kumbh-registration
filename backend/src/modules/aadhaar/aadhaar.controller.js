import { findDemoAadhaar } from './aadhaar.service.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { ApiError } from '../../utils/ApiError.js';

export const lookupAadhaar = asyncHandler(async (req, res) => {
  const { aadhaar } = req.body || {};

  if (!aadhaar || typeof aadhaar !== 'string' || !/^\d{12}$/.test(aadhaar.trim())) {
    throw ApiError.badRequest('Please provide a valid 12-digit Aadhaar number.');
  }

  const record = findDemoAadhaar(aadhaar.trim());

  if (!record) {
    throw ApiError.notFound('No record found for this Aadhaar number.');
  }

  return new ApiResponse(200, record, 'Aadhaar details retrieved successfully').send(res);
});

export default { lookupAadhaar };
