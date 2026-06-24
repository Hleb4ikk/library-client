import { Router } from "express";
import { updateComment, deleteComment } from "../controllers/books.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { validationMiddleware } from "../middleware/validation.middleware.js";
import { commentBodySchema, commentIdParamSchema } from "../schemas/books.schema.js";

const commentsRouter = Router();

commentsRouter.put(
  "/:id",
  authMiddleware,
  validationMiddleware(commentIdParamSchema, "params"),
  validationMiddleware(commentBodySchema, "body"),
  updateComment
);

commentsRouter.delete(
  "/:id",
  authMiddleware,
  validationMiddleware(commentIdParamSchema, "params"),
  deleteComment
);

export default commentsRouter;
