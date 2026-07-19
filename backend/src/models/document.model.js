import mongoose from 'mongoose';
import { DOCUMENT_TYPE_VALUES } from '../constants/documentType.js';

const documentSchema = new mongoose.Schema(
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
    type: {
      type: String,
      enum: DOCUMENT_TYPE_VALUES,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    publicId: {
      type: String,
      required: true,
    },
    originalName: {
      type: String,
      default: null,
    },
    mimeType: {
      type: String,
      required: true,
    },
    sizeBytes: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
);

export const Document = mongoose.model('Document', documentSchema);

export default Document;
