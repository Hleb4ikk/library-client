import z from "zod";

const passwordSchema = z
  .string()
  .regex(
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
  );

export const registerSchema = z.object({
  username: z.string().min(3),
  email: z.email(),
  password: passwordSchema,
});

export const verifyEmailSchema = z.object({
  email: z.email(),
  code: z.coerce.number().int().min(100000).max(999999),
});

export const resendVerificationSchema = z.object({
  email: z.email(),
});

export const forgotPasswordSchema = z.object({
  email: z.email(),
});

export const resetPasswordSchema = z.object({
  email: z.email(),
  code: z.coerce.number().int().min(100000).max(999999),
  password: passwordSchema,
});
