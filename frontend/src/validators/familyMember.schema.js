import { z } from 'zod';
import { RELATIONSHIP_OPTIONS } from '@/utils/relationshipOptions';

export const familyMemberSchema = z.object({
  fullName: z.string().trim().min(2, 'Full name is required'),
  relationship: z.enum(RELATIONSHIP_OPTIONS, { message: 'Relationship is required' }),
  age: z.coerce.number().int().min(0, 'Enter a valid age (0–120)').max(120, 'Enter a valid age (0–120)'),
  gender: z.enum(['male', 'female', 'other'], { message: 'Please select a gender.' }),
  aadhaarNumber: z
    .string()
    .trim()
    .regex(/^[0-9]{12}$/, 'Enter a valid 12-digit numeric Aadhaar number'),
  photoUrl: z.string().trim().min(1, 'Profile photo is required for family member.'),
});

export const familyMemberDefaults = {
  fullName: '',
  relationship: '',
  age: '',
  gender: '',
  aadhaarNumber: '',
  photoUrl: '',
};

export default familyMemberSchema;
