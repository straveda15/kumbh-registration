import { z } from 'zod';

export const pilgrimLoginSchema = {
  body: z.object({
    email: z.string().trim().email('A valid email is required'),
    password: z.string().min(1, 'Password is required'),
  }),
};

// Backs the "set my account credentials" step during registration — a
// pilgrim's own fullName/email/mobile are already collected by the Personal
// Information step's generic stepDataSchema; this is the separate,
// credential-specific payload so a plaintext password is never routed
// through that generic PersonalInformation.data blob (see
// registration.controller.js's saveAccountCredentials).
export const setAccountCredentialsSchema = {
  body: z
    .object({
      fullName: z.string().trim().min(2, 'Full name is required'),
      email: z.string().trim().email('A valid email is required'),
      mobile: z
        .string()
        .trim()
        .regex(/^[0-9]{10}$/, 'Enter a valid 10-digit mobile number'),
      password: z.string().min(6, 'Password must be at least 6 characters'),
      confirmPassword: z.string().min(1, 'Confirm your password'),
    })
    .refine((data) => data.password === data.confirmPassword, {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    }),
};

export default { pilgrimLoginSchema, setAccountCredentialsSchema };
