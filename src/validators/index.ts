import { z } from 'zod';

export const usernameValidation = z
  .string()
  .min(4, 'username must be at least 2 characters')
  .max(20, 'no more than 20 characters')
  .regex(/^[a-zA-Z0-9_]+$/, 'username should not contain special characters');

export const signUpSchema = z.object({
  username: usernameValidation,
  email: z.string().email({ message: 'invalid email address' }),
  password: z
    .string()
    .min(8, 'password must be at least 8 characters')
    .max(16, 'password can not be greater than 16 characters'),
});

export const signInSchema = z.object({
  identifier: z.string(),
  password: z.string(),
});

export const verifySchema = z.object({
  code: z.string().length(6, 'verify code must be 6 characters long'),
});

export const acceptMessageSchema = z.object({
  accepting: z.boolean(),
});

export const messageSchema = z.object({
  content: z
    .string()
    .min(10, 'content must be at least of 10 character')
    .max(300, 'content must be no longer than 300 characters'),
});