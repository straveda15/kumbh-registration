import { z } from 'zod';

export const TRAVEL_MODES = [
  'Railway',
  'MSRTC Bus',
  'State Transport Bus',
  'Private Vehicle',
  'Flight',
  'Walking Group',
  'Other',
];

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
    travelModeOther: z.string().trim().optional(),
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
  )
  .refine(
    (data) => {
      if (!data.holyBathDate) return true;
      const bath = toDateOnly(data.holyBathDate);
      if (data.arrivalDate && bath < toDateOnly(data.arrivalDate)) return false;
      if (data.departureDate && bath > toDateOnly(data.departureDate)) return false;
      return true;
    },
    {
      message: 'Expected Holy Bath Date must be between your Arrival Date and Departure Date.',
      path: ['holyBathDate'],
    }
  );

export const travelInformationDefaults = {
  arrivalDate: '',
  departureDate: '',
  mode: '',
  travelModeOther: '',
  vehicleNumber: '',
  railwayStation: '',
  busStand: '',
  holyBathDate: '',
};

export default travelInformationSchema;
