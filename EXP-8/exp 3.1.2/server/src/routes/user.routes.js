import { Router } from "express";
import { getCurrentUser } from "../controllers/user.controller.js";
import { requireAuth } from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.get("/me", requireAuth, getCurrentUser);

export default userRouter;
