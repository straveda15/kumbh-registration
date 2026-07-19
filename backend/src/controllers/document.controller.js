import * as documentService from '../services/document.service.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { ApiResponse } from '../utils/ApiResponse.js';

export const getUploadSignature = asyncHandler(async (req, res) => {
  const signatureData = await documentService.generateUploadSignature(
    req.draft.registration,
    req.body.type
  );
  return new ApiResponse(200, signatureData, 'Upload signature generated').send(res);
});

export const createDocument = asyncHandler(async (req, res) => {
  const document = await documentService.registerDocument(req.draft.registration, req.body);
  return new ApiResponse(201, { document }, 'Document saved successfully').send(res);
});

export const listMyDocuments = asyncHandler(async (req, res) => {
  const documents = await documentService.listDocuments(req.draft.registration);
  return new ApiResponse(200, { documents }, 'Documents fetched successfully').send(res);
});

export const deleteMyDocument = asyncHandler(async (req, res) => {
  await documentService.deleteDocument(req.draft.registration, req.params.id);
  return new ApiResponse(200, {}, 'Document deleted successfully').send(res);
});

export default { getUploadSignature, createDocument, listMyDocuments, deleteMyDocument };
