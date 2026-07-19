import { z } from 'zod';
import { DOCUMENT_TYPE_VALUES } from '../constants/documentType.js';
import { objectIdSchema } from './common.validator.js';

export const uploadSignatureSchema = {
  body: z.object({
    type: z.enum(DOCUMENT_TYPE_VALUES),
  }),
};

export const createDocumentSchema = {
  body: z.object({
    type: z.enum(DOCUMENT_TYPE_VALUES),
    url: z.string().url(),
    publicId: z.string().min(1),
    originalName: z.string().trim().optional(),
    mimeType: z.string().min(1),
    sizeBytes: z.coerce.number().int().positive(),
  }),
};

export const documentIdParamSchema = {
  params: z.object({ id: objectIdSchema }),
};

export default { uploadSignatureSchema, createDocumentSchema, documentIdParamSchema };
