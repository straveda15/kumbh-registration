import mongoose from 'mongoose';
import { STEP_STATUS, STEP_STATUS_VALUES } from '../constants/stepStatus.js';

// Wizard Step 1 — Personal Information.
// Leaf-level fields (name, DOB, gender, photo, ...) are not finalized yet,
// so they live in `data` until the final field list is provided. See
// registration.model.js / plan notes for the reasoning.
const personalInformationSchema = new mongoose.Schema(
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

export const PersonalInformation = mongoose.model('PersonalInformation', personalInformationSchema);

export default PersonalInformation;
