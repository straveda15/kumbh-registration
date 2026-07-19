import { z } from 'zod';

// The spec doesn't enumerate family-member fields; kept intentionally
// minimal and consistent with Step 1's gender options.
export const familyMemberSchema = z.object({
  fullName: z.string().trim().min(2, 'Full name is required'),
  relationship: z.string().trim().min(1, 'Relationship is required'),
  age: z.coerce.number().int().min(0, 'Enter a valid age').max(120, 'Enter a valid age'),
  gender: z.enum(['male', 'female', 'other']),
});

export const familyMemberDefaults = {
  fullName: '',
  relationship: '',
  age: '',
  // See personalInformation.schema.js's gender default for why '' and not
  // undefined — same controlled-<Select> requirement.
  gender: '',
};

export default familyMemberSchema;
