import mongoose from 'mongoose';

const ACTOR_TYPES = ['user', 'admin', 'system'];

// Immutable append-only log — no updatedAt.
const activityLogSchema = new mongoose.Schema(
  {
    actorType: {
      type: String,
      enum: ACTOR_TYPES,
      required: true,
    },
    actorId: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
      index: true,
    },
    registrationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Registration',
      default: null,
      index: true,
    },
    action: {
      type: String,
      required: true,
      trim: true,
    },
    metadata: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    ipAddress: {
      type: String,
      default: null,
    },
    userAgent: {
      type: String,
      default: null,
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

export const ActivityLog = mongoose.model('ActivityLog', activityLogSchema);

export default ActivityLog;
