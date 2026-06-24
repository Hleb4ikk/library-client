import z from "zod";

export const changeLoginBodySchema = z.object({
    new_username: z.string().min(3)
});

export const changePasswordBodySchema = z.object({
    current_password: z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/),
    new_password: z.string().regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/)
});

export const getLikesQuerySchema = z.object({
    page: z
        .string()
        .optional()
        .transform((val) => (val ? parseInt(val, 10) : 1))
        .refine((val) => !isNaN(val) && val > 0, { message: "Номер страницы должен быть положительным числом" }),
    limit: z
        .string()
        .optional()
        .transform((val) => (val ? parseInt(val, 10) : 3))
        .refine((val) => !isNaN(val) && val > 0, { message: "Лимит должен быть положительным числом" }),
})