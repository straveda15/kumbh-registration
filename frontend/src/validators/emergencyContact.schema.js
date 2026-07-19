import { z } from 'zod';

export const emergencyContactSchema = z.object({
  contactName: z.string().trim().min(2, 'Contact name is required'),
  relationship: z.string().trim().min(1, 'Relationship is required'),
  phone: z
    .string()
    .trim()
    .regex(/^[0-9]{10}$/, 'Enter a valid 10-digit phone number'),
  alternativePhone: z
    .string()
    .trim()
    .regex(/^[0-9]{10}$/, 'Enter a valid 10-digit phone number')
    .or(z.literal(''))
    .optional(),
});

export const emergencyContactDefaults = {
  contactName: '',
  relationship: '',
  phone: '',
  alternativePhone: '',
};

export default emergencyContactSchema;
