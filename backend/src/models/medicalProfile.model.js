import mongoose from 'mongoose';
import { STEP_STATUS, STEP_STATUS_VALUES } from '../constants/stepStatus.js';

// Wizard Step 3 — Medical Information. See personalInformation.model.js for
// the rationale behind the flexible `data` field.
const medicalProfileSchema = new mongoose.Schema(
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

export const MedicalProfile = mongoose.model('MedicalProfile', medicalProfileSchema);

export default MedicalProfile;
