import type { NextFunction, Request, Response } from "express";

import { extractBearerToken, verifyAccessToken } from "@/utils/token.utils.js";
import ApiError from "@/classes/ApiError.js";

declare module "express-serve-static-core" {
  interface Request {
    userId?: number;
  }
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const token = extractBearerToken(req.headers.authorization);

  if (!token) {
    throw new ApiError(401, "Unauthorized");
  }

  const payload = verifyAccessToken(token);

  if (!payload) {
    throw new ApiError(401, "Unauthorized");
  }

  req.userId = payload.userId;
  next();
}
