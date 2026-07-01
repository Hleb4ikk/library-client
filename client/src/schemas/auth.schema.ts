import { z } from "zod";

const passwordSchema = z
    .string()
    .min(1, "Пароль обязателен")
    .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/,
        "Пароль должен содержать минимум 6 символов, большую и маленькую букву, цифру и спецсимвол",
    );

export const loginSchema = z.object({
    username: z
        .string()
        .min(1, "Логин обязателен")
        .min(3, "Логин должен содержать минимум 3 символа"),
    password: passwordSchema,
});

export const registerSchema = z
    .object({
        username: z
            .string()
            .min(1, "Логин обязателен")
            .min(3, "Логин должен содержать минимум 3 символа")
            .max(50, "Логин не может превышать 50 символов"),
        email: z
            .string()
            .min(1, "Email обязателен")
            .email("Введите корректный email"),
        password: passwordSchema,
        confirmPassword: z.string().min(1, "Подтверждение пароля обязательно"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Пароли не совпадают",
        path: ["confirmPassword"],
    });

export const verifyCodeSchema = z.object({
    code: z
        .string()
        .min(1, "Код обязателен")
        .regex(/^\d{6}$/, "Код состоит из 6 цифр"),
});

export const forgotPasswordSchema = z.object({
    email: z
        .string()
        .min(1, "Email обязателен")
        .email("Введите корректный email"),
});

export const resetPasswordSchema = z
    .object({
        code: z
            .string()
            .min(1, "Код обязателен")
            .regex(/^\d{6}$/, "Код состоит из 6 цифр"),
        password: passwordSchema,
        confirmPassword: z.string().min(1, "Подтверждение пароля обязательно"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Пароли не совпадают",
        path: ["confirmPassword"],
    });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type VerifyCodeFormData = z.infer<typeof verifyCodeSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;