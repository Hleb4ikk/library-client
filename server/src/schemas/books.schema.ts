import { z } from "zod";

export const searchBooksSchema = z.object({
  query: z.object({
    q: z.string().optional(),
    title: z.string().optional(),
    author: z.string().optional(),
    page: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 1))
      .refine((val) => !isNaN(val) && val > 0, { message: "Кол-во страниц должно быть положительным" }),
  }),
});

export const getBookDetailsSchema = z.object({
  params: z.object({
    olid: z.string().min(1, "OLID требуется"),
  }),
});

export const getBookCommentsSchema = z.object({
  params: z.object({
    olid: z.string().min(1, "OLID требуется"),
  }),
  query: z.object({
    page: z
      .string()
      .optional()
      .transform((val) => (val ? parseInt(val, 10) : 1))
      .refine((val) => !isNaN(val) && val > 0, { message: "Кол-во страниц должно быть положительным" }),
  }),
});