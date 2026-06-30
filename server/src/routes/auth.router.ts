import { Router } from "express";
import {
  forgotPassword,
  login,
  register,
  resendVerification,
  resetPasswordHandler,
  verifyEmailHandler,
} from "@/controllers/auth.controller.js";
import { validationMiddleware } from "@/middleware/validation.middleware.js";
import {
  forgotPasswordSchema,
  registerSchema,
  resendVerificationSchema,
  resetPasswordSchema,
  verifyEmailSchema,
} from "@/schemas/register.schema.js";
import { loginSchema } from "@/schemas/login.schema.js";

const authRouter = Router();

authRouter.post("/register", validationMiddleware(registerSchema), register);
authRouter.post(
  "/verify-email",
  validationMiddleware(verifyEmailSchema),
  verifyEmailHandler,
);
authRouter.post(
  "/resend-verification",
  validationMiddleware(resendVerificationSchema),
  resendVerification,
);
authRouter.post(
  "/forgot-password",
  validationMiddleware(forgotPasswordSchema),
  forgotPassword,
);
authRouter.post(
  "/reset-password",
  validationMiddleware(resetPasswordSchema),
  resetPasswordHandler,
);
authRouter.post("/login", validationMiddleware(loginSchema), login);

export default authRouter;
