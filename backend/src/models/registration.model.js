import mongoose from 'mongoose';
import { REGISTRATION_STATUS, REGISTRATION_STATUS_VALUES } from '../constants/registrationStatus.js';
import { STEP_STATUS, STEP_STATUS_VALUES } from '../constants/stepStatus.js';

const stepStatusField = {
  type: String,
  enum: STEP_STATUS_VALUES,
  default: STEP_STATUS.PENDING,
};

const registrationSchema = new mongoose.Schema(
  {
    eventId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Event',
      required: true,
    },
    qrId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'QRCode',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    digitalPassId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'DigitalPass',
      default: null,
    },
    registrationStatus: {
      type: String,
      enum: REGISTRATION_STATUS_VALUES,
      default: REGISTRATION_STATUS.DRAFT,
    },
    // Left unset (not null) until final-submit assigns a value — a sparse
    // unique index only excludes documents where the field is absent, so an
    // explicit `default: null` would make every draft collide on the same
    // null slot in the index.
    registrationNumber: {
      type: String,
      unique: true,
      sparse: true,
    },
    pilgrimId: {
      type: String,
      unique: true,
      sparse: true,
    },
    // Fixed set of known wizard steps. Each step's own answers live in its
    // dedicated collection (PersonalInformation, EmergencyContact, ...);
    // this only tracks per-step completion for the wizard UI/autosave.
    stepStatus: {
      personalInformation: stepStatusField,
      emergencyContact: stepStatusField,
      medicalInformation: stepStatusField,
      travelInformation: stepStatusField,
      accommodation: stepStatusField,
      familyMembers: stepStatusField,
    },
    completionPercentage: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    draftStartedAt: {
      type: Date,
      default: Date.now,
    },
    submittedAt: {
      type: Date,
      default: null,
    },
    approvedAt: {
      type: Date,
      default: null,
    },
    rejectedAt: {
      type: Date,
      default: null,
    },
    cancelledAt: {
      type: Date,
      default: null,
    },
    infoRequestedAt: {
      type: Date,
      default: null,
    },
    suspendedAt: {
      type: Date,
      default: null,
    },
    restoredAt: {
      type: Date,
      default: null,
    },
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Admin',
      default: null,
    },
    rejectionReason: {
      type: String,
      default: null,
    },
    // Generic reason/note for info-request and suspend actions —
    // rejectionReason stays reject-specific.
    statusNote: {
      type: String,
      default: null,
    },
    dashboardCreated: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

registrationSchema.index({ eventId: 1 });
registrationSchema.index({ qrId: 1 });
registrationSchema.index({ userId: 1 });
registrationSchema.index({ registrationStatus: 1 });

export const Registration = mongoose.model('Registration', registrationSchema);

export default Registration;
