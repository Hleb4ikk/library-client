import { Router } from "express";
import authRouter from "./auth.router.js";
import booksRouter from "./books.router.js";

const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/books', booksRouter);

export default apiRouter;