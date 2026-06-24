import { changeLogin, changePassword, getLikes, getProfile } from "@/controllers/users.controller.js";
import { validationMiddleware } from "@/middleware/validation.middleware.js";
import { changeLoginBodySchema, changePasswordBodySchema, getLikesQuerySchema } from "@/schemas/profile.schema.js";
import { Router } from "express";

const profileRouter = Router();

profileRouter.get('/', getProfile);
profileRouter.put('/login', validationMiddleware(changeLoginBodySchema), changeLogin);
profileRouter.put('/password', validationMiddleware(changePasswordBodySchema), changePassword);
profileRouter.get('/likes', validationMiddleware(getLikesQuerySchema, "query"), getLikes);

export default profileRouter;