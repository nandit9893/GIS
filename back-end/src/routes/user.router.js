import { Router } from "express";
import { userLogin, userLogout, userRegister } from "../controllers/user.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.route("/register").post(userRegister);
userRouter.route("/login").post(userLogin);
userRouter.route("/logout").post(verifyJWT, userLogout);

export default userRouter;