import mongoose from 'mongoose';
import { STEP_STATUS, STEP_STATUS_VALUES } from '../constants/stepStatus.js';

// Wizard Step 6 — Family Members. Unlike the other step models, a
// registration can have many of these, so registrationId is indexed but
// not unique. Overall step completion (has the citizen finished adding
// family members) is tracked on Registration.stepStatus.familyMembers, not
// on individual documents here.
const familyMemberSchema = new mongoose.Schema(
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
      index: true,
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

export const FamilyMember = mongoose.model('FamilyMember', familyMemberSchema);

export default FamilyMember;
