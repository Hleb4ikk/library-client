import ApiError from "@/classes/ApiError.js";
import type { NextFunction, Request, Response } from "express";

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction) {
  if (err instanceof ApiError) {
    return res
      .status(err.status)
      .json({ success: false, message: err.message });
  }

  return res.status(500).json({ success: false, message: err.message });
}
