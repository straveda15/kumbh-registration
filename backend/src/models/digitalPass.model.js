import mongoose from 'mongoose';
import {
  DIGITAL_PASS_STATUS,
  DIGITAL_PASS_STATUS_VALUES,
  VERIFICATION_STATUS,
  VERIFICATION_STATUS_VALUES,
} from '../constants/digitalPassStatus.js';

// Created (schema only) in this increment. Generation of passNumber/qrCode/
// qrImage happens in a later increment once final-submit exists — hence
// those fields are unique+sparse so many pending passes can coexist before
// generation without violating the unique index.
const digitalPassSchema = new mongoose.Schema(
  {
    registrationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Registration',
      required: true,
      unique: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    passNumber: {
      type: String,
      unique: true,
      sparse: true,
      default: null,
    },
    qrCode: {
      type: String,
      unique: true,
      sparse: true,
      default: null,
    },
    qrImage: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: DIGITAL_PASS_STATUS_VALUES,
      default: DIGITAL_PASS_STATUS.PENDING,
    },
    verificationStatus: {
      type: String,
      enum: VERIFICATION_STATUS_VALUES,
      default: VERIFICATION_STATUS.PENDING,
    },
    issuedAt: {
      type: Date,
      default: null,
    },
    revokedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export const DigitalPass = mongoose.model('DigitalPass', digitalPassSchema);

export default DigitalPass;
