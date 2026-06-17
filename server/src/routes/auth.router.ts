import { Router } from "express";
import { login, register } from "@/controllers/auth.controller.js";
import { validationMiddleware } from "@/middleware/validation.middleware.js";
import { registerSchema } from "@/schemas/register.schema.js";
import { loginSchema } from "@/schemas/login.schema.js";

const authRouter = Router();

authRouter.post('/register', validationMiddleware(registerSchema), register);
authRouter.post('/login', validationMiddleware(loginSchema), login);

export default authRouter;