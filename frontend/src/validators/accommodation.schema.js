import { z } from 'zod';

export const ACCOMMODATION_TYPES = ['Hotel', 'Tent', 'Ashram', 'Relative', 'Other'];

export const accommodationSchema = z
  .object({
    type: z.enum(ACCOMMODATION_TYPES, { message: 'Please select an accommodation type.' }),
    address: z.string().trim().min(1, 'Accommodation address is required'),
    expectedArrivalDate: z.string().optional().or(z.literal('')),
    expectedDepartureDate: z.string().optional().or(z.literal('')),
  })
  .refine(
    (data) => {
      if (data.expectedArrivalDate && data.expectedDepartureDate) {
        return new Date(data.expectedDepartureDate) >= new Date(data.expectedArrivalDate);
      }
      return true;
    },
    {
      message: 'Expected Departure Date cannot be earlier than Expected Arrival Date',
      path: ['expectedDepartureDate'],
    }
  );

export const accommodationDefaults = {
  type: '',
  address: '',
  expectedArrivalDate: '',
  expectedDepartureDate: '',
};

export default accommodationSchema;
