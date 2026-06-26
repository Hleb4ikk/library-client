import { changeLogin, changePassword, getLikes, getProfile, searchMyBooks } from "@/controllers/users.controller.js";
import { validationMiddleware } from "@/middleware/validation.middleware.js";
import { changeLoginBodySchema, changePasswordBodySchema, getLikesQuerySchema, searchMyBooksQuerySchema } from "@/schemas/profile.schema.js";
import { Router } from "express";

const profileRouter = Router();

profileRouter.get('/', getProfile);
profileRouter.put('/login', validationMiddleware(changeLoginBodySchema), changeLogin);
profileRouter.put('/password', validationMiddleware(changePasswordBodySchema), changePassword);
profileRouter.get('/likes', validationMiddleware(getLikesQuerySchema, "query"), getLikes);
profileRouter.get('/books/search', validationMiddleware(searchMyBooksQuerySchema, "query"), searchMyBooks);

export default profileRouter;