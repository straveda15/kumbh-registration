import { z } from 'zod';
import { objectIdSchema } from './common.validator.js';
import { REGISTRATION_STATUS_VALUES } from '../constants/registrationStatus.js';

export const startRegistrationSchema = {
  body: z.object({
    code: z.string().min(1, 'QR code is required'),
  }),
};

// Shared by every singular-step autosave endpoint (personal/emergency/
// medical/travel/accommodation): the leaf fields aren't finalized yet, so
// the payload stays open-ended until they are (see plan notes).
export const stepDataSchema = {
  body: z.record(z.string(), z.any()),
};

export const familyBulkSchema = {
  body: z.object({
    members: z.array(z.record(z.string(), z.any())),
  }),
};

export const familyMemberSchema = {
  body: z.record(z.string(), z.any()),
};

export const familyMemberIdParamSchema = {
  params: z.object({ id: objectIdSchema }),
};

export const registrationIdParamSchema = {
  params: z.object({ id: objectIdSchema }),
};

export const rejectRegistrationSchema = {
  params: z.object({ id: objectIdSchema }),
  body: z.object({
    reason: z.string().trim().min(1, 'Rejection reason is required'),
  }),
};

export const requestInfoSchema = {
  params: z.object({ id: objectIdSchema }),
  body: z.object({
    reason: z.string().trim().min(1, 'A reason is required'),
  }),
};

export const suspendRegistrationSchema = {
  params: z.object({ id: objectIdSchema }),
  body: z.object({
    reason: z.string().trim().min(1, 'A reason is required'),
  }),
};

export const listRegistrationsQuerySchema = {
  query: z.object({
    page: z.string().optional(),
    limit: z.string().optional(),
    sortBy: z.string().optional(),
    sortOrder: z.enum(['asc', 'desc']).optional(),
    eventId: objectIdSchema.optional(),
    status: z.enum(REGISTRATION_STATUS_VALUES).optional(),
    gender: z.string().optional(),
    state: z.string().optional(),
    district: z.string().optional(),
    dateFrom: z.string().optional(),
    dateTo: z.string().optional(),
    search: z.string().optional(),
  }),
};

export default {
  startRegistrationSchema,
  stepDataSchema,
  familyBulkSchema,
  familyMemberSchema,
  familyMemberIdParamSchema,
  registrationIdParamSchema,
  rejectRegistrationSchema,
  requestInfoSchema,
  suspendRegistrationSchema,
  listRegistrationsQuerySchema,
};
