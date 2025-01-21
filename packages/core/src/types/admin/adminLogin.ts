import * as z from "zod"

export const baseSchema = {
  email: z
    .string()
    .min(1, 'Email is required')
    .email('Please enter a valid email address'),
};

export const showPasswordSchema = z.object({
  ...baseSchema,
  password: z
    .string()
    .min(1, 'Password is required')
    .min(8, 'Password must be at least 8 characters'),
  otp: z.string().optional(),
});

export const showOtpSchema = z.object({
  ...baseSchema,
  password: z.string().optional(),
  otp: z
    .string()
    .min(1, 'OTP is required')
    .length(6, 'OTP must be exactly 6 digits')
    .regex(/^\d+$/, 'OTP must contain only numbers'),
});

export const generateOtpSchema = z.object({
  ...baseSchema,
  password: z.string().optional(),
  otp: z.string().optional(),
});

export type LoginFormValues = z.infer<typeof showPasswordSchema | typeof showOtpSchema | typeof generateOtpSchema>;
