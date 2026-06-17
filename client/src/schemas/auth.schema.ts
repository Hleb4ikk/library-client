import { z } from "zod";

// Схема для логина
export const loginSchema = z.object({
    
    name: z
        .string()
        .min(2, "Имя обязательно"),
    email: z
        .string()
        .min(1, "Email обязателен")
        .email("Некорректный email адрес"),
    password: z
        .string()
        .min(1, "Пароль обязателен")
        .min(6, "Пароль должен содержать минимум 6 символов"),
});

// Схема для регистрации
export const registerSchema = z
    .object({
        name: z
            .string()
            .min(1, "Имя обязательно")
            .min(2, "Имя должно содержать минимум 2 символа")
            .max(50, "Имя не может превышать 50 символов"),
        email: z
            .string()
            .min(1, "Email обязателен")
            .email("Некорректный email адрес"),
        password: z
            .string()
            .min(1, "Пароль обязателен")
            .min(6, "Пароль должен содержать минимум 6 символов")
            .max(100, "Пароль не может превышать 100 символов"),
        confirmPassword: z.string().min(1, "Подтверждение пароля обязательно"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Пароли не совпадают",
        path: ["confirmPassword"],
    });

// Типы форм, выведенные из схем
export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
