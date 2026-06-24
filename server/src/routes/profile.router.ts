import { changeLogin, getProfile } from "@/controllers/users.controller.js";
import { validationMiddleware } from "@/middleware/validation.middleware.js";
import { changeLoginBodySchema } from "@/schemas/profile.schema.js";
import { Router } from "express";

const profileRouter = Router();

profileRouter.get('/', getProfile);
profileRouter.put('/login', validationMiddleware(changeLoginBodySchema), changeLogin);

export default profileRouter;