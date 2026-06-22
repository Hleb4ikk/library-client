import { Router } from "express";
import { upsertReadingListItem, deleteReadingListItem } from "../controllers/reading-list.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";
import { validationMiddleware } from "../middleware/validation.middleware.js";
import { readingListBodySchema, readingListIdParamSchema } from "../schemas/reading-list.schema.js";

const readingListRouter = Router();

readingListRouter.post(
  "/",
  authMiddleware,
  validationMiddleware(readingListBodySchema, "body"),
  upsertReadingListItem
);

readingListRouter.delete(
  "/:id",
  authMiddleware,
  validationMiddleware(readingListIdParamSchema, "params"),
  deleteReadingListItem
);

export default readingListRouter;
