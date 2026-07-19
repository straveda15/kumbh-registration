import mongoose from 'mongoose';

const SCAN_RESULTS = ['approved', 'rejected'];

// Immutable append-only log — no updatedAt. One row per gate-entry
// verification attempt (Part 6: Time, Operator, Device, Browser, IP,
// Location, Verification Result).
const scanLogSchema = new mongoose.Schema(
  {
    digitalPassId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DigitalPass',
      required: true,
      index: true,
    },
    registrationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Registration',
      required: true,
      index: true,
    },
    operatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      required: true,
    },
    result: {
      type: String,
      enum: SCAN_RESULTS,
      required: true,
    },
    reason: {
      type: String,
      default: null,
    },
    // True if this pass already had an approved entry today, independent
    // of what the operator ultimately decided on THIS attempt — lets the
    // operator dashboard count every flagged attempt, not just rejections.
    wasDuplicate: {
      type: Boolean,
      default: false,
    },
    device: {
      type: String,
      default: null,
    },
    browser: {
      type: String,
      default: null,
    },
    ipAddress: {
      type: String,
      default: null,
    },
    // Future-ready — nothing populates this yet (see plan notes).
    location: {
      type: mongoose.Schema.Types.Mixed,
      default: null,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

scanLogSchema.index({ createdAt: -1 });

export const ScanLog = mongoose.model('ScanLog', scanLogSchema);

export default ScanLog;
