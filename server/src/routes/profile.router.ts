import {
  changeLogin,
  changePassword,
  getComments,
  getLikes,
  getProfile,
  searchMyBooks,
} from "@/controllers/users.controller.js";
import { validationMiddleware } from "@/middleware/validation.middleware.js";
import {
  changeLoginBodySchema,
  changePasswordBodySchema,
  paginationQuerySchema,
  searchMyBooksQuerySchema,
} from "@/schemas/profile.schema.js";

import { Router } from "express";

const profileRouter = Router();

profileRouter.get("/", getProfile);
profileRouter.put(
  "/login",
  validationMiddleware(changeLoginBodySchema),
  changeLogin,
);
profileRouter.put(
  "/password",
  validationMiddleware(changePasswordBodySchema),
  changePassword,
);
profileRouter.get(
  "/books/search",
  validationMiddleware(searchMyBooksQuerySchema, "query"),
  searchMyBooks,
);
profileRouter.get(
  "/likes",
  validationMiddleware(paginationQuerySchema, "query"),
  getLikes,
);
profileRouter.get(
  "/comments",
  validationMiddleware(paginationQuerySchema, "query"),
  getComments,
);

export default profileRouter;
