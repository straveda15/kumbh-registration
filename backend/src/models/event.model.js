import mongoose from 'mongoose';
import { EVENT_STATUS, EVENT_STATUS_VALUES } from '../constants/eventStatus.js';

const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Event name is required'],
      trim: true,
    },
    description: {
      type: String,
      trim: true,
      default: '',
    },
    startDate: {
      type: Date,
      required: [true, 'Start date is required'],
    },
    endDate: {
      type: Date,
      required: [true, 'End date is required'],
    },
    registrationStartDate: {
      type: Date,
      default: null,
    },
    registrationEndDate: {
      type: Date,
      default: null,
    },
    capacity: {
      type: Number,
      min: 1,
      default: null,
    },
    venue: {
      name: { type: String, trim: true, default: '' },
      address: { type: String, trim: true, default: '' },
    },
    status: {
      type: String,
      enum: EVENT_STATUS_VALUES,
      default: EVENT_STATUS.DRAFT,
    },
    qrCode: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'QRCode',
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

eventSchema.index({ status: 1 });
eventSchema.index({ startDate: 1, endDate: 1 });
eventSchema.index({ registrationStartDate: 1, registrationEndDate: 1 });

export const Event = mongoose.model('Event', eventSchema);

export default Event;
