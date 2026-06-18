import { Router } from "express";
import { booksController } from "@/controllers/books.controller.js";

const booksRouter = Router();

booksRouter.get("/", booksController.search);
booksRouter.get("/:olid", booksController.getDetails);
booksRouter.get("/:olid/comments", booksController.getComments);

export default booksRouter;