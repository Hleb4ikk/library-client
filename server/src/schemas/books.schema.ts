import { z } from "zod";

export const searchBooksQuerySchema = z.object({
  q: z.string().optional(),
  title: z.string().optional(),
  author: z.string().optional(),
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1))
    .refine((val) => !isNaN(val) && val > 0, { message: "Номер страницы должен быть положительным числом" }),
});

export const bookOlidParamSchema = z.object({
  olid: z.string().min(1, "Идентификатор OLID обязателен"),
});

export const getCommentsQuerySchema = z.object({
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1))
    .refine((val) => !isNaN(val) && val > 0, { message: "Номер страницы должен быть положительным числом" }),
});

export const commentBodySchema = z.object({
  text: z.string().min(1, "Комментарий не может быть пустым").max(2000, "Комментарий слишком длинный (максимум 2000 символов)"),
});

export const commentIdParamSchema = z.object({
  id: z.string().transform((val) => parseInt(val, 10)).refine((val) => !isNaN(val), { message: "ID должен быть числом" }),
});