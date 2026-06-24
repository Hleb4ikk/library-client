import { Router } from "express";
import authRouter from "./auth.router.js";
import booksRouter from "./books.router.js";
import commentsRouter from "./comments.router.js";
import readingListRouter from "./reading-list.router.js";
import profileRouter from "./profile.router.js";
import { authMiddleware } from "@/middleware/auth.middleware.js";

const apiRouter = Router();

apiRouter.use('/auth', authRouter);
apiRouter.use('/books', booksRouter);
apiRouter.use('/comments', commentsRouter);
apiRouter.use('/reading-list', readingListRouter);
apiRouter.use('/me', authMiddleware, profileRouter);

export default apiRouter;