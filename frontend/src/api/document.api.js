import { axiosClient } from './axiosClient';

export const getUploadSignature = (type) => axiosClient.post('/documents/signature', { type });

// The backend wraps list/single-item payloads in a named key
// (`{ document }` / `{ documents }`, see backend/src/controllers/
// document.controller.js) inside the standard {success, message, data}
// envelope. axiosClient's interceptor only unwraps that outer envelope, so
// callers here unwrap the named key too — every consumer (useDocuments,
// DocumentUploadCard, the optimistic delete in useDeleteDocument) can then
// assume `documents` is always the bare array, never `{ documents: [...] }`.
export const createDocument = (payload) =>
  axiosClient.post('/documents', payload).then((res) => res.document);

export const listDocuments = () => axiosClient.get('/documents').then((res) => res.documents);

export const deleteDocument = (id) => axiosClient.delete(`/documents/${id}`);

export default { getUploadSignature, createDocument, listDocuments, deleteDocument };
