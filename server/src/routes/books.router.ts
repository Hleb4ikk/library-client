
import { Router } from "express";
import { 
  search, 
  getDetails, 
  getComments, 
  createComment, 
  toggleBookLike 
} from "../controllers/books.controller.js";
import { authMiddleware, optionalAuthMiddleware } from "../middleware/auth.middleware.js";
import { validationMiddleware } from "../middleware/validation.middleware.js";
import {
  searchBooksQuerySchema,
  bookOlidParamSchema,
  getCommentsQuerySchema,
  commentBodySchema
} from "../schemas/books.schema.js";

const booksRouter = Router();

booksRouter.get(
  "/",
  optionalAuthMiddleware,
  validationMiddleware(searchBooksQuerySchema, "query"),
  search
);

booksRouter.get(
  "/:olid",
  optionalAuthMiddleware,
  validationMiddleware(bookOlidParamSchema, "params"),
  getDetails
);

booksRouter.get(
  "/:olid/comments", 
  validationMiddleware(bookOlidParamSchema, "params"), 
  validationMiddleware(getCommentsQuerySchema, "query"), 
  getComments
);

booksRouter.post(
  "/:olid/comments", 
  authMiddleware, 
  validationMiddleware(bookOlidParamSchema, "params"), 
  validationMiddleware(commentBodySchema, "body"), 
  createComment
);

booksRouter.post(
  "/:olid/like",
  authMiddleware,
  validationMiddleware(bookOlidParamSchema, "params"),
  toggleBookLike
);

export default booksRouter;

