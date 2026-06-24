import { z } from "zod";
import { readingListStatuses } from "@/database/schemas/readingList.js";

export const getReadingListQuerySchema = z.object({
  status: z.enum(readingListStatuses, {error: "Невалидный статус"}).optional(),
  page: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 1))
    .refine((val) => !isNaN(val) && val > 0, { message: "Номер страницы должен быть положительным числом" }),
  limit: z
    .string()
    .optional()
    .transform((val) => (val ? parseInt(val, 10) : 4))
    .refine((val) => !isNaN(val) && val > 0, { message: "Номер страницы должен быть положительным числом" }),
});

export const readingListBodySchema = z.object({
  book_olid: z.string().min(1, "Идентификатор OLID обязателен"),
  status: z.enum(readingListStatuses, { error: "Невалидный статус" }),
});

export const readingListIdParamSchema = z.object({
  id: z
    .string()
    .transform((val) => parseInt(val, 10))
    .refine((val) => !isNaN(val), { message: "ID должен быть числом" }),
});
