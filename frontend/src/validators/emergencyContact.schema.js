import { z } from 'zod';
import { RELATIONSHIP_OPTIONS } from '@/utils/relationshipOptions';

const phoneRegex = /^[0-9]{10}$/;

export const emergencyContactSchema = z.object({
  // Contact 1 (Mandatory)
  contactName: z.string().trim().min(2, 'Contact name is required'),
  relationship: z.enum(RELATIONSHIP_OPTIONS, { message: 'Relationship is required' }),
  phone: z
    .string()
    .trim()
    .regex(phoneRegex, 'Enter a valid 10-digit phone number'),
  alternativePhone: z
    .string()
    .trim()
    .regex(phoneRegex, 'Enter a valid 10-digit phone number')
    .or(z.literal(''))
    .optional(),

  // Contact 2 (Mandatory)
  contactName2: z.string().trim().min(2, 'Contact name is required for Emergency Contact 2'),
  relationship2: z.enum(RELATIONSHIP_OPTIONS, { message: 'Relationship is required for Emergency Contact 2' }),
  phone2: z
    .string()
    .trim()
    .regex(phoneRegex, 'Enter a valid 10-digit phone number for Emergency Contact 2'),
  alternativePhone2: z
    .string()
    .trim()
    .regex(phoneRegex, 'Enter a valid 10-digit phone number')
    .or(z.literal(''))
    .optional(),
});

export const emergencyContactDefaults = {
  contactName: '',
  relationship: '',
  phone: '',
  alternativePhone: '',
  contactName2: '',
  relationship2: '',
  phone2: '',
  alternativePhone2: '',
};

export default emergencyContactSchema;
