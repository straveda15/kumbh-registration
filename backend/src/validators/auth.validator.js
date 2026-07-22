import { z } from 'zod';

export const loginSchema = {
  body: z.object({
    email: z.string().email('A valid email is required'),
    password: z.string().min(1, 'Password is required'),
  }),
};

export const refreshTokenSchema = {
  body: z.object({
    refreshToken: z.string().min(1, 'Refresh token is required').optional(),
  }),
};

export const updateProfileSchema = {
  body: z.object({
    name: z.string().trim().min(2, 'Name is required'),
    email: z.string().trim().email('A valid email is required'),
  }),
};

export const changePasswordSchema = {
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

export default { loginSchema, refreshTokenSchema, updateProfileSchema, changePasswordSchema };
