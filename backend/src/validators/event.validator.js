import { z } from 'zod';
import { EVENT_STATUS_VALUES } from '../constants/eventStatus.js';
import { objectIdSchema } from './common.validator.js';

const dateString = z.coerce.date();
const optionalDate = z.preprocess((value) => (value === '' || value === null ? undefined : value), dateString.optional());
const venueSchema = z.object({
  name: z.string().trim().max(150).optional().default(''),
  address: z.string().trim().max(500).optional().default(''),
});

export const createEventSchema = {
  body: z
    .object({
      name: z.string().trim().min(1, 'Event name is required'),
      description: z.string().trim().optional().default(''),
      startDate: dateString,
      endDate: dateString,
      registrationStartDate: optionalDate,
      registrationEndDate: optionalDate,
      capacity: z.coerce.number().int().positive().optional(),
      venue: venueSchema.optional().default({}),
      status: z.enum(EVENT_STATUS_VALUES).optional(),
    })
    .refine((data) => data.endDate >= data.startDate, {
      message: 'endDate must be on or after startDate',
      path: ['endDate'],
    })
    .refine(
      (data) => !data.registrationStartDate || !data.registrationEndDate || data.registrationEndDate >= data.registrationStartDate,
      { message: 'registrationEndDate must be on or after registrationStartDate', path: ['registrationEndDate'] }
    ),
};

export const updateEventSchema = {
  params: z.object({ id: objectIdSchema }),
  body: z
    .object({
      name: z.string().trim().min(1).optional(),
      description: z.string().trim().optional(),
      startDate: dateString.optional(),
      endDate: dateString.optional(),
      registrationStartDate: optionalDate,
      registrationEndDate: optionalDate,
      capacity: z.coerce.number().int().positive().nullable().optional(),
      venue: venueSchema.optional(),
      status: z.enum(EVENT_STATUS_VALUES).optional(),
    })
    .refine((data) => !data.startDate || !data.endDate || data.endDate >= data.startDate, {
      message: 'endDate must be on or after startDate',
      path: ['endDate'],
    })
    .refine(
      (data) => !data.registrationStartDate || !data.registrationEndDate || data.registrationEndDate >= data.registrationStartDate,
      { message: 'registrationEndDate must be on or after registrationStartDate', path: ['registrationEndDate'] }
    ),
};

export const eventIdParamSchema = {
  params: z.object({ id: objectIdSchema }),
};

export default { createEventSchema, updateEventSchema, eventIdParamSchema };
