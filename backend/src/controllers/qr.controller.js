import * as qrService from '../services/qr.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';
import { getOriginFromRequest } from '../utils/origin.helper.js';

export const generateQR = asyncHandler(async (req, res) => {
  const origin = getOriginFromRequest(req);
  const qr = await qrService.generateQR({ ...req.body, origin }, req.admin._id);
  return new ApiResponse(201, { qr }, 'QR code generated successfully').send(res);
});

export const listQR = asyncHandler(async (req, res) => {
  const qrs = await qrService.listQR(req.query);
  return new ApiResponse(200, { qrs }, 'QR codes fetched successfully').send(res);
});

export const regenerateQR = asyncHandler(async (req, res) => {
  const origin = getOriginFromRequest(req);
  const qr = await qrService.regenerateQR(req.params.eventId, req.admin._id, origin);
  return new ApiResponse(200, { qr }, 'Existing QR code retrieved successfully').send(res);
});

// Public endpoint: resolving/scanning a QR code by its unique code.
export const getQRByCode = asyncHandler(async (req, res) => {
  const qr = await qrService.getQRByCode(req.params.code, { trackScan: true });
  return new ApiResponse(200, { qr }, 'QR code fetched successfully').send(res);
});

export const updateQR = asyncHandler(async (req, res) => {
  const qr = await qrService.updateQR(req.params.id, req.body);
  return new ApiResponse(200, { qr }, 'QR code updated successfully').send(res);
});

export const deleteQR = asyncHandler(async (req, res) => {
  await qrService.deleteQR(req.params.id);
  return new ApiResponse(200, {}, 'QR code deleted successfully').send(res);
});

export default { generateQR, listQR, regenerateQR, getQRByCode, updateQR, deleteQR };
