import { Router } from "express";
import { register } from "@/controllers/auth.controller.js";
import { validationMiddleware } from "@/middleware/validation.middleware.js";
import { registerSchema } from "@/schemas/register.schema.js";

const authRouter = Router();

authRouter.post('/register', validationMiddleware(registerSchema), register);

export default authRouter;