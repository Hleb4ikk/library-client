import { getProfile } from "@/controllers/users.controller.js";
import { Router } from "express";

const profileRouter = Router();

profileRouter.get('/', getProfile);

export default profileRouter;