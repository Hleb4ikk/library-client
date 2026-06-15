import type { NextFunction, Request, Response } from "express";
import { z, type ZodType } from "zod";

import ApiError from "@/classes/ApiError.js";

type ValidationSource = "body" | "query" | "params";

export function validationMiddleware<T extends ZodType>(
  schema: T,
  source: ValidationSource = "body",
) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    try {
      const validatedData = schema.parse(req[source]);
      req[source] = validatedData;
      next();
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ApiError(400, `Ошибка валидации`, error.issues);
      }

      throw error;
    }
  };
}
