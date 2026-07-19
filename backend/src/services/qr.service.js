import QRCodeLib from 'qrcode';
import { QRCode } from '../models/qrcode.model.js';
import { Event } from '../models/event.model.js';
import { QR_STATUS } from '../constants/qrStatus.js';
import { ApiError } from '../utils/ApiError.js';
import { generateUniqueCode } from '../utils/generateCode.js';
import config from '../config/env.js';

export const generateQR = async ({ eventId, expiresAt }, createdBy) => {
  const event = await Event.findById(eventId);
  if (!event) {
    throw ApiError.notFound('Event not found');
  }

  const uniqueCode = generateUniqueCode();
  // QR codes are opened by a browser, so they must target the React app,
  // not the Express API origin. FRONTEND_URL can be set to the host LAN IP
  // for a physical phone on the same Wi-Fi network.
  const url = `${config.frontendUrl}/register/${uniqueCode}`;
  const image = await QRCodeLib.toDataURL(url);

  const qr = await QRCode.create({
    eventId,
    uniqueCode,
    eventCode: uniqueCode,
    url,
    image,
    qrUrl: url,
    qrImage: image,
    expiresAt: expiresAt || null,
    createdBy,
  });

  event.qrCode = qr._id;
  await event.save();

  return qr;
};

export const listQR = async ({ eventId, status } = {}) => {
  const filter = {};
  if (eventId) filter.eventId = eventId;
  if (status) filter.status = status;
  return QRCode.find(filter).populate('eventId', 'name status').sort({ createdAt: -1 });
};

export const regenerateQR = async (eventId, createdBy) => {
  const event = await Event.findById(eventId);
  if (!event) throw ApiError.notFound('Event not found');
  if (event.qrCode) await updateQR(event.qrCode, { status: QR_STATUS.DISABLED });
  return generateQR({ eventId }, createdBy);
};

const autoExpireIfNeeded = async (qr) => {
  if (qr.status === QR_STATUS.ACTIVE && qr.expiresAt && qr.expiresAt.getTime() < Date.now()) {
    qr.status = QR_STATUS.EXPIRED;
    await qr.save();
  }
  return qr;
};

export const getQRByCode = async (code, { trackScan = false } = {}) => {
  const qr = await QRCode.findOne({ uniqueCode: code }).populate('eventId');

  if (!qr) {
    throw ApiError.notFound('QR code not found');
  }

  await autoExpireIfNeeded(qr);

  if (trackScan) {
    if (qr.status !== QR_STATUS.ACTIVE) {
      throw ApiError.badRequest(`QR code is ${qr.status}`);
    }
    qr.scanCount += 1;
    qr.lastScannedAt = new Date();
    await qr.save();
  }

  return qr;
};

export const validateQRForRegistration = async (code) => {
  const qr = await getQRByCode(code, { trackScan: false });

  if (qr.status !== QR_STATUS.ACTIVE) {
    throw ApiError.badRequest(`QR code is ${qr.status} and cannot be used for registration`);
  }

  if (!qr.eventId) {
    throw ApiError.badRequest('QR code is not linked to a valid event');
  }

  return qr;
};

// Same active/linked-event checks as validateQRForRegistration, but keyed
// by id — used when only qrId is on hand (e.g. re-validating at submit time).
export const validateQRById = async (qrId) => {
  const qr = await QRCode.findById(qrId).populate('eventId');

  if (!qr) {
    throw ApiError.notFound('QR code not found');
  }

  await autoExpireIfNeeded(qr);

  if (qr.status !== QR_STATUS.ACTIVE) {
    throw ApiError.badRequest(`QR code is ${qr.status} and cannot be used for registration`);
  }

  if (!qr.eventId) {
    throw ApiError.badRequest('QR code is not linked to a valid event');
  }

  return qr;
};

export const updateQR = async (id, payload) => {
  const qr = await QRCode.findById(id);

  if (!qr) {
    throw ApiError.notFound('QR code not found');
  }

  if (payload.status) qr.status = payload.status;
  if (payload.expiresAt !== undefined) qr.expiresAt = payload.expiresAt;

  await qr.save();
  return qr;
};

export const disableQR = async (id) => updateQR(id, { status: QR_STATUS.DISABLED });

export const expireQR = async (id) => updateQR(id, { status: QR_STATUS.EXPIRED });

export const deleteQR = async (id) => {
  const qr = await QRCode.findByIdAndDelete(id);

  if (!qr) {
    throw ApiError.notFound('QR code not found');
  }

  await Event.updateOne({ qrCode: id }, { $set: { qrCode: null } });

  return qr;
};

export default {
  generateQR,
  listQR,
  regenerateQR,
  getQRByCode,
  validateQRForRegistration,
  validateQRById,
  updateQR,
  disableQR,
  expireQR,
  deleteQR,
};
