import { z } from 'zod';
import { objectIdSchema } from './common.validator.js';

export const verifyPassSchema = {
  body: z.object({
    code: z.string().trim().min(1, 'A pass code or registration/pilgrim ID is required'),
  }),
};

export const logScanSchema = {
  body: z.object({
    digitalPassId: objectIdSchema,
    result: z.enum(['approved', 'rejected']),
    reason: z.string().trim().optional(),
  }),
};

export const scanHistoryQuerySchema = {
  query: z.object({
    page: z.coerce.number().int().positive().optional(),
    limit: z.coerce.number().int().positive().optional(),
    result: z.enum(['approved', 'rejected']).optional(),
    dateFrom: z.string().optional(),
    dateTo: z.string().optional(),
  }),
};
