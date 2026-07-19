import { z } from 'zod';
import { QR_STATUS_VALUES } from '../constants/qrStatus.js';
import { objectIdSchema } from './common.validator.js';

export const generateQRSchema = {
  body: z.object({
    eventId: objectIdSchema,
    expiresAt: z.coerce.date().optional(),
  }),
};

export const qrCodeParamSchema = {
  params: z.object({ code: z.string().min(1) }),
};

export const qrIdParamSchema = {
  params: z.object({ id: objectIdSchema }),
};

export const updateQRSchema = {
  params: z.object({ id: objectIdSchema }),
  body: z.object({
    status: z.enum(QR_STATUS_VALUES).optional(),
    expiresAt: z.coerce.date().nullable().optional(),
  }),
};

export const listQRSchema = {
  query: z.object({
    eventId: objectIdSchema.optional(),
    status: z.enum(QR_STATUS_VALUES).optional(),
  }),
};

export const regenerateQRSchema = { params: z.object({ eventId: objectIdSchema }) };

export default { generateQRSchema, qrCodeParamSchema, qrIdParamSchema, updateQRSchema, listQRSchema, regenerateQRSchema };
