import { Router } from "express";
// Импортируем отдельные функции контроллера напрямую
import { 
  search, 
  getDetails, 
  getComments, 
  createComment, 
  updateComment, 
  deleteComment 
} from "../controllers/books.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { validationMiddleware } from "../middleware/validation.middleware.js";
import {
  searchBooksQuerySchema,
  bookOlidParamSchema,
  getCommentsQuerySchema,
  commentBodySchema,
  commentIdParamSchema
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

booksRouter.put(
  "/comments/:id", 
  authMiddleware, 
  validationMiddleware(commentIdParamSchema, "params"), 
  validationMiddleware(commentBodySchema, "body"), 
  updateComment
);

booksRouter.delete(
  "/comments/:id", 
  authMiddleware, 
  validationMiddleware(commentIdParamSchema, "params"), 
  deleteComment
);

export default booksRouter;