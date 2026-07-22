import { z } from 'zod';

export const ACCOMMODATION_TYPES = ['Hotel', 'Tent', 'Ashram', 'Relative', 'Other'];

export const accommodationSchema = z.object({
  type: z.enum(ACCOMMODATION_TYPES, { message: 'Please select an accommodation type.' }),
  address: z.string().trim().min(1, 'Accommodation address is required'),
});

export const accommodationDefaults = {
  // See personalInformation.schema.js's gender default for why '' and not
  // undefined — same controlled-<Select> requirement.
  type: '',
  address: '',
};

export default accommodationSchema;
