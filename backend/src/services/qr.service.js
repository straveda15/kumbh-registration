import QRCodeLib from 'qrcode';
import { QRCode } from '../models/qrcode.model.js';
import { Event } from '../models/event.model.js';
import { Registration } from '../models/registration.model.js';
import { QR_STATUS } from '../constants/qrStatus.js';
import { ApiError } from '../utils/ApiError.js';
import { generateUniqueCode } from '../utils/generateCode.js';
import config from '../config/env.js';

// Every Event has EXACTLY ONE permanent Registration QR Code.
// If a QR code already exists for the event, it is returned immediately
// without changing the uniqueCode, URL, image, or document.
// Only events without a QR code generate one permanently using the frontend origin.
export const generateQR = async ({ eventId, expiresAt, origin }, createdBy) => {
  const event = await Event.findById(eventId);
  if (!event) {
    throw ApiError.notFound('Event not found');
  }

  // If the Event already has a QR code document, return it unchanged immediately.
  if (event.qrCode) {
    const existing = await QRCode.findById(event.qrCode);
    if (existing) {
      return existing;
    }
  }

  // Create a permanent QR code ONCE for this event
  const uniqueCode = generateUniqueCode();
  const frontendOrigin = (origin || config.frontendUrl || 'http://localhost:5173').replace(/\/$/, '');
  const url = `${frontendOrigin}/register/${uniqueCode}`;
  const image = await QRCodeLib.toDataURL(url);

  const fields = {
    eventId,
    uniqueCode,
    eventCode: uniqueCode,
    url,
    image,
    qrUrl: url,
    qrImage: image,
    status: QR_STATUS.ACTIVE,
    scanCount: 0,
    lastScannedAt: null,
    expiresAt: expiresAt || null,
    createdBy,
  };

  const qr = await QRCode.create(fields);

  event.qrCode = qr._id;
  await event.save();

  return qr;
};

// Resolved through each Event's own `qrCode` reference — the single source
// of truth for "the current QR for this event" — rather than querying
// QRCode by eventId directly, so any pre-existing duplicate/orphaned QR
// documents (from before regenerate stopped creating new rows) are never
// surfaced here even if they're still sitting in the collection.
export const listQR = async ({ eventId, status } = {}) => {
  const eventFilter = {};
  if (eventId) eventFilter._id = eventId;

  const events = await Event.find(eventFilter).select('qrCode').lean();
  const qrIds = events.map((event) => event.qrCode).filter(Boolean);

  const filter = { _id: { $in: qrIds } };
  if (status) filter.status = status;

  return QRCode.find(filter).populate('eventId', 'name status').sort({ createdAt: -1 });
};

// Regenerate endpoint returns the existing QR code unchanged.
export const regenerateQR = async (eventId, createdBy, origin) => generateQR({ eventId, origin }, createdBy);

// Atomic — avoids the lost-update race a read/increment/save cycle would
// have under concurrent scans (two requests reading the same scanCount
// before either writes back).
export const incrementScanCount = (qrId) =>
  QRCode.findByIdAndUpdate(qrId, { $inc: { scanCount: 1 }, $set: { lastScannedAt: new Date() } }, { new: true });

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
    return incrementScanCount(qr._id);
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
  const qr = await QRCode.findById(id);

  if (!qr) {
    throw ApiError.notFound('QR code not found');
  }

  const hasRegistrations = await Registration.exists({ qrId: id });
  if (hasRegistrations) {
    throw ApiError.conflict('Cannot delete a QR code that has associated registrations');
  }

  const hasEvent = await Event.exists({ qrCode: id });
  if (hasEvent) {
    throw ApiError.conflict('Cannot delete a QR code linked to an event. Delete the event instead.');
  }

  await qr.deleteOne();

  return qr;
};

export default {
  generateQR,
  listQR,
  regenerateQR,
  incrementScanCount,
  getQRByCode,
  validateQRForRegistration,
  validateQRById,
  updateQR,
  disableQR,
  expireQR,
  deleteQR,
};
