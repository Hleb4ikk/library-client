
import { Router } from "express";
import { 
  search, 
  getDetails, 
  getComments, 
  createComment, 
  toggleBookLike 
} from "../controllers/books.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
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
  validationMiddleware(searchBooksQuerySchema, "query"), 
  search
);

booksRouter.get(
  "/:olid", 
  validationMiddleware(bookOlidParamSchema, "params"), 
  getDetails
);

booksRouter.get(
  "/:olid/comments", 
  validationMiddleware(bookOlidParamSchema, "params"), 
  validationMiddleware(getCommentsQuerySchema, "query"), 
  getComments
);

// Защищенные роуты
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

