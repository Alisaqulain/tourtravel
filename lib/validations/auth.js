import { z } from 'zod';

const email = z.string().email().max(255).transform((v) => v.toLowerCase().trim());
const password = z.string().min(6, 'Password must be at least 6 characters').max(128);

export const signupSchema = z.object({
  name: z.string().min(1, 'Name is required').max(120).trim(),
  email,
  password,
});

export const loginSchema = z.object({
  email,
  password: z.string().min(1, 'Password is required'),
});

export const forgotPasswordSchema = z.object({
  email,
});

const otp = z.string().length(6, 'OTP must be 6 digits').regex(/^\d{6}$/, 'OTP must be 6 digits');

export const resetPasswordSchema = z.object({
  email,
  otp,
  newPassword: z.string().min(6, 'Password must be at least 6 characters').max(128),
});
