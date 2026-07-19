import { z } from 'zod';

export const TRAVEL_MODES = ['Train', 'Bus', 'Car', 'Flight', 'Other'];

export const travelInformationSchema = z
  .object({
    arrivalDate: z.string().min(1, 'Arrival date is required'),
    departureDate: z.string().min(1, 'Departure date is required'),
    mode: z.enum(TRAVEL_MODES),
    vehicleNumber: z.string().trim().optional(),
    railwayStation: z.string().trim().optional(),
    busStand: z.string().trim().optional(),
    holyBathDate: z.string().min(1, 'Expected Holy Bath date is required'),
  })
  .refine((data) => new Date(data.departureDate) >= new Date(data.arrivalDate), {
    message: 'Departure date must be on or after the arrival date',
    path: ['departureDate'],
  });

export const travelInformationDefaults = {
  arrivalDate: '',
  departureDate: '',
  // See personalInformation.schema.js's gender default for why '' and not
  // undefined — same controlled-<Select> requirement.
  mode: '',
  vehicleNumber: '',
  railwayStation: '',
  busStand: '',
  holyBathDate: '',
};

export default travelInformationSchema;
