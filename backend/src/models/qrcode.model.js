import mongoose from 'mongoose';
import { QR_STATUS, QR_STATUS_VALUES } from '../constants/qrStatus.js';

const qrCodeSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    uniqueCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    // Demo-facing aliases retained alongside the original fields so existing
    // registration links and consumers remain compatible.
    eventCode: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },
    url: {
      type: String,
      required: true,
    },
    image: {
      type: String, // base64 data URL of the generated QR image
      default: null,
    },
    qrUrl: { type: String, required: true },
    qrImage: { type: String, default: null },
    status: {
      type: String,
      enum: QR_STATUS_VALUES,
      default: QR_STATUS.ACTIVE,
    },
    scanCount: {
      type: Number,
      default: 0,
      min: 0,
    },
    lastScannedAt: {
      type: Date,
      default: null,
    },
    expiresAt: {
      type: Date,
      default: null,
    },
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: true,
    },
  },
  { timestamps: true }
);

qrCodeSchema.index({ status: 1 });

export const QRCode = mongoose.model('QRCode', qrCodeSchema);

export default QRCode;
