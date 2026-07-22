import { z } from 'zod';

export const TRAVEL_MODES = [
  'Railway',
  'MSRTC Bus',
  'State Transport Bus',
  'Private Vehicle',
  'Flight',
  'Walking Group',
];

// Date-only comparisons (arrivalDate/departureDate are "YYYY-MM-DD" strings
// from <input type="date">) — normalize to midnight so time-of-day never
// skews the >= comparisons below.
const toDateOnly = (value) => {
  const date = new Date(value);
  date.setHours(0, 0, 0, 0);
  return date;
};

export const getMinArrivalDate = () => {
  const tomorrow = new Date();
  tomorrow.setHours(0, 0, 0, 0);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return tomorrow;
};

export const travelInformationSchema = z
  .object({
    arrivalDate: z.string().min(1, 'Arrival date is required'),
    departureDate: z.string().min(1, 'Departure date is required'),
    mode: z.enum(TRAVEL_MODES, { message: 'Mode of travel is required' }),
    vehicleNumber: z.string().trim().optional(),
    railwayStation: z.string().trim().optional(),
    busStand: z.string().trim().optional(),
    holyBathDate: z.string().min(1, 'Expected Holy Bath date is required'),
  })
  .refine((data) => !data.arrivalDate || toDateOnly(data.arrivalDate) >= getMinArrivalDate(), {
    message: 'Arrival date cannot be today or in the past',
    path: ['arrivalDate'],
  })
  .refine(
    (data) =>
      !data.departureDate || !data.arrivalDate || toDateOnly(data.departureDate) >= toDateOnly(data.arrivalDate),
    {
      message: 'Departure date must be on or after the arrival date',
      path: ['departureDate'],
    }
  );

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
