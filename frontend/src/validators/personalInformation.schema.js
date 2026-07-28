import { z } from 'zod';
import { INDIAN_STATES_AND_UTS } from '@/utils/indianStates';

// Expanded list of commonly used Indian languages.
export const LANGUAGE_OPTIONS = [
  'English',
  'Hindi',
  'Marathi',
  'Gujarati',
  'Kannada',
  'Tamil',
  'Telugu',
  'Malayalam',
  'Punjabi',
  'Bengali',
  'Urdu',
  'Sanskrit',
  'Nepali',
  'Kashmiri',
];

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
    gender: z.enum(['male', 'female', 'other'], { message: 'Please select your gender.' }),
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
    // Mandatory: exactly 12 numeric digits.
    aadhaarNumber: z
      .string()
      .trim()
      .min(1, 'Aadhaar card number is required')
      .regex(/^[0-9]{12}$/, 'Enter a valid 12-digit numeric Aadhaar number'),
    alternateMobile: z
      .string()
      .trim()
      .regex(/^[0-9]{10}$/, 'Enter a valid 10-digit mobile number')
      .optional()
      .or(z.literal('')),
    // Preferred language is now optional.
    language: z
      .enum(LANGUAGE_OPTIONS, { message: 'Select a preferred language' })
      .optional()
      .or(z.literal('')),
    // Address is now optional.
    address: z.string().trim().optional().or(z.literal('')),
    state: z.enum(INDIAN_STATES_AND_UTS, { message: 'State is required' }),
    // District is now optional (cascading — populated after state pick).
    district: z.string().trim().optional().or(z.literal('')),
    // Taluka is now optional (cascading — populated after district pick).
    taluka: z.string().trim().optional().or(z.literal('')),
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
  aadhaarNumber: '',
  alternateMobile: '',
  language: '',
  address: '',
  state: '',
  district: '',
  taluka: '',
  village: '',
  pinCode: '',
};

export default personalInformationSchema;
