import type { NextFunction, Request, Response } from "express";

import { extractBearerToken, verifyAccessToken } from "@/utils/token.utils.js";

declare module "express-serve-static-core" {
  interface Request {
    userId?: string;
  }
}

export function authMiddleware(
  req: Request,
  res: Response,
  next: NextFunction,
): void {
  const token = extractBearerToken(req.headers.authorization);

  if (!token) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return;
  }

  const payload = verifyAccessToken(token);

  if (!payload) {
    res.status(401).json({ success: false, message: "Unauthorized" });
    return;
  }

  req.userId = payload.userId;
  next();
}