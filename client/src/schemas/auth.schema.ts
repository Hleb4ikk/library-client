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
        password: passwordSchema,
        confirmPassword: z.string().min(1, "Подтверждение пароля обязательно"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Пароли не совпадают",
        path: ["confirmPassword"],
    });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;