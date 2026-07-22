import { z } from 'zod';

// Mirrors backend/src/validators/auth.validator.js's updateProfileSchema.
export const adminUpdateProfileSchema = z.object({
  name: z.string().trim().min(2, 'Name is required'),
  email: z.string().trim().email('Enter a valid email address'),
});

export const adminUpdateProfileDefaults = {
  name: '',
  email: '',
};

// Mirrors backend/src/validators/auth.validator.js's changePasswordSchema.
export const adminChangePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: z.string().min(6, 'New password must be at least 6 characters'),
    confirmPassword: z.string().min(1, 'Confirm your new password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const adminChangePasswordDefaults = {
  currentPassword: '',
  newPassword: '',
  confirmPassword: '',
};

export default {
  adminUpdateProfileSchema,
  adminUpdateProfileDefaults,
  adminChangePasswordSchema,
  adminChangePasswordDefaults,
};
