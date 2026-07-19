import cloudinary from '../config/cloudinary.js';
import { Document } from '../models/document.model.js';
import { ApiError } from '../utils/ApiError.js';
import { generateUniqueCode } from '../utils/generateCode.js';
import config from '../config/env.js';
import {
  SINGLE_INSTANCE_DOCUMENT_TYPES,
  ACCEPTED_MIME_TYPES,
  MAX_DOCUMENT_SIZE_BYTES,
} from '../constants/documentType.js';

export const generateUploadSignature = async (registration, type) => {
  if (!config.cloudinary.isConfigured) {
    throw ApiError.internal(
      'Document uploads are not configured yet. Set CLOUDINARY_* env vars to enable this.'
    );
  }

  const timestamp = Math.round(Date.now() / 1000);
  const folder = `${config.cloudinary.uploadFolder}/${registration._id}/${type}`;
  const publicId = `${type}-${generateUniqueCode()}`;

  const signature = cloudinary.utils.api_sign_request(
    { timestamp, folder, public_id: publicId },
    config.cloudinary.apiSecret
  );

  return {
    signature,
    timestamp,
    apiKey: config.cloudinary.apiKey,
    cloudName: config.cloudinary.cloudName,
    folder,
    publicId,
  };
};

export const registerDocument = async (registration, payload) => {
  const { type, url, publicId, originalName, mimeType, sizeBytes } = payload;

  if (!ACCEPTED_MIME_TYPES.includes(mimeType)) {
    throw ApiError.badRequest('Unsupported file type');
  }
  if (sizeBytes > MAX_DOCUMENT_SIZE_BYTES) {
    throw ApiError.badRequest('File exceeds the maximum allowed size');
  }

  if (SINGLE_INSTANCE_DOCUMENT_TYPES.includes(type)) {
    const existingDocuments = await Document.find({ registrationId: registration._id, type });
    await Promise.all(
      existingDocuments.map(async (doc) => {
        // Best-effort: an orphaned Cloudinary asset is a minor storage cost,
        // not worth failing the replacement upload over.
        await cloudinary.uploader.destroy(doc.publicId).catch(() => {});
        await doc.deleteOne();
      })
    );
  }

  const document = await Document.create({
    userId: registration.userId,
    registrationId: registration._id,
    type,
    url,
    publicId,
    originalName,
    mimeType,
    sizeBytes,
  });

  return document;
};

export const listDocuments = async (registration) =>
  Document.find({ registrationId: registration._id }).sort({ createdAt: -1 });

export const deleteDocument = async (registration, documentId) => {
  const document = await Document.findOne({
    _id: documentId,
    registrationId: registration._id,
  });

  if (!document) {
    throw ApiError.notFound('Document not found');
  }

  await cloudinary.uploader.destroy(document.publicId).catch(() => {});
  await document.deleteOne();

  return document;
};

// Reused by registration.service.js's deleteRegistrationCascade — keeps
// the Cloudinary-destroy-then-delete pattern in one place.
export const deleteAllDocuments = async (registration) => {
  const documents = await Document.find({ registrationId: registration._id });
  await Promise.all(
    documents.map(async (doc) => {
      await cloudinary.uploader.destroy(doc.publicId).catch(() => {});
      await doc.deleteOne();
    })
  );
};

export default {
  generateUploadSignature,
  registerDocument,
  listDocuments,
  deleteDocument,
  deleteAllDocuments,
};
