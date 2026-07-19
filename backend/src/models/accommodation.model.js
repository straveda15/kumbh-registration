import mongoose from 'mongoose';
import { STEP_STATUS, STEP_STATUS_VALUES } from '../constants/stepStatus.js';

// Wizard Step 5 — Accommodation. See personalInformation.model.js for the
// rationale behind the flexible `data` field.
const accommodationSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    registrationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Registration',
      required: true,
      unique: true,
    },
    status: {
      type: String,
      enum: STEP_STATUS_VALUES,
      default: STEP_STATUS.PENDING,
    },
    completedAt: {
      type: Date,
      default: null,
    },
    data: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
  },
  { timestamps: true }
);

export const Accommodation = mongoose.model('Accommodation', accommodationSchema);

export default Accommodation;
