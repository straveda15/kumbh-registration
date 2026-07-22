import { z } from 'zod';

export const pilgrimLoginSchema = {
  body: z.object({
    registrationNumber: z.string().trim().min(1, 'Registration number is required'),
    password: z.string().min(1, 'Password is required'),
  }),
};

// Backs the "set my account credentials" step during registration — a
// pilgrim's own fullName/email/mobile are already collected by the Personal
// Information step's generic stepDataSchema; this is the separate,
// credential-specific payload so a plaintext password is never routed
// through that generic PersonalInformation.data blob (see
// registration.controller.js's saveAccountCredentials).
//
// password/confirmPassword are optional here — this same endpoint backs two
// callers: the wizard's Personal Information step (sets a password the
// first time, alongside name/email/mobile) and the Profile page's "Edit
// Profile" form (name/email/mobile only, any time, password untouched).
// Changing an existing password is a separate, dedicated flow — see
// changePasswordSchema below.
export const setAccountCredentialsSchema = {
  body: z
    .object({
      fullName: z.string().trim().min(2, 'Full name is required'),
      email: z.string().trim().email('A valid email is required'),
      mobile: z
        .string()
        .trim()
        .regex(/^[0-9]{10}$/, 'Enter a valid 10-digit mobile number'),
      password: z.string().min(6, 'Password must be at least 6 characters').optional().or(z.literal('')),
      confirmPassword: z.string().optional().or(z.literal('')),
    })
    .refine((data) => (data.password || '') === (data.confirmPassword || ''), {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    }),
};

// A logged-in pilgrim changing their own password (Profile page) — distinct
// from setAccountCredentialsSchema above, which is for setting/updating the
// non-password fields (and only ever sets an initial password during
// registration, never requires the current one).
export const changePilgrimPasswordSchema = {
  body: z
    .object({
      currentPassword: z.string().min(1, 'Current password is required'),
      newPassword: z.string().min(6, 'New password must be at least 6 characters'),
      confirmPassword: z.string().min(1, 'Confirm your new password'),
    })
    .refine((data) => data.newPassword === data.confirmPassword, {
      message: 'Passwords do not match',
      path: ['confirmPassword'],
    }),
};

export default { pilgrimLoginSchema, setAccountCredentialsSchema, changePilgrimPasswordSchema };
