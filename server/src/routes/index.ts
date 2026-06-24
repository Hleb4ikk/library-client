import { Router } from "express";
import authRouter from "./auth.router.js";
import booksRouter from "./books.router.js";
import commentsRouter from "./comments.router.js";

const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/books', booksRouter);
apiRouter.use('/comments', commentsRouter);

export default apiRouter;