import mongoose from 'mongoose';

const NOTIFICATION_CHANNELS = ['in_app', 'email', 'sms', 'whatsapp'];
export const NOTIFICATION_STATUSES = ['unread', 'read', 'archived'];

const notificationSchema = new mongoose.Schema(
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
      default: null,
    },
    type: {
      type: String,
      required: true,
      trim: true,
    },
    title: {
      type: String,
      required: true,
      trim: true,
    },
    message: {
      type: String,
      required: true,
      trim: true,
    },
    channel: {
      type: String,
      enum: NOTIFICATION_CHANNELS,
      default: 'in_app',
    },
    status: {
      type: String,
      enum: NOTIFICATION_STATUSES,
      default: 'unread',
    },
    readAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

notificationSchema.index({ userId: 1, status: 1 });

export const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
