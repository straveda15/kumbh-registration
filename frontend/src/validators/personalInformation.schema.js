import { z } from 'zod';

// Backs Step 1 (Personal Information). The backend stores this step's
// answers as a flexible `data` object (see backend increment 1 design
// notes) — this schema is the frontend's own source of truth for exactly
// which fields that object contains today.
//
// password/confirmPassword back the pilgrim account created alongside this
// step (see registration.api.js's saveAccountCredentials) — they're
// collected here since fullName/email/mobile already live in this step,
// but are NEVER sent through the generic personal-info save; the wizard
// step component splits them out into their own dedicated request so a
// plaintext password never touches PersonalInformation.data. Left blank
// (not required) once already set, so editing your address later doesn't
// force re-entering your password every time.
export const personalInformationSchema = z
  .object({
    fullName: z.string().trim().min(2, 'Full name is required'),
    gender: z.enum(['male', 'female', 'other']),
    dob: z.string().min(1, 'Date of birth is required'),
    mobile: z
      .string()
      .trim()
      .regex(/^[0-9]{10}$/, 'Enter a valid 10-digit mobile number'),
    // Required (not optional like before) — this is now also the
    // pilgrim's login identifier.
    email: z.string().trim().email('Enter a valid email address'),
    password: z.string().optional().default(''),
    confirmPassword: z.string().optional().default(''),
    nationality: z.string().trim().min(1, 'Nationality is required'),
    language: z.string().trim().min(1, 'Preferred language is required'),
    address: z.string().trim().min(1, 'Address is required'),
    state: z.string().trim().min(1, 'State is required'),
    district: z.string().trim().min(1, 'District is required'),
    taluka: z.string().trim().min(1, 'Taluka is required'),
    village: z.string().trim().min(1, 'Village/Town is required'),
    pinCode: z
      .string()
      .trim()
      .regex(/^[0-9]{6}$/, 'Enter a valid 6-digit PIN code'),
  })
  .refine((data) => !data.password || data.password.length >= 6, {
    message: 'Password must be at least 6 characters',
    path: ['password'],
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const personalInformationDefaults = {
  fullName: '',
  // '' rather than undefined: keeps the gender <Select> controlled from the
  // very first render (an undefined value makes Radix treat it as
  // uncontrolled, then it flips to controlled — and warns — the moment a
  // real value loads or is picked). Not a valid enum member, so Zod still
  // requires a real selection before the step validates.
  gender: '',
  dob: '',
  mobile: '',
  email: '',
  password: '',
  confirmPassword: '',
  nationality: 'Indian',
  language: '',
  address: '',
  state: '',
  district: '',
  taluka: '',
  village: '',
  pinCode: '',
};

export default personalInformationSchema;
