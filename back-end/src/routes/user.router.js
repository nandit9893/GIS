import { Router } from "express";
import { deleteCompleteDrawingData, getDrawings, userDrawing, userLogin, userLogout, userRegister } from "../controllers/user.controllers.js";
import { verifyJWT } from "../middlewares/auth.middleware.js";

const userRouter = Router();

userRouter.route("/register").post(userRegister);
userRouter.route("/login").post(userLogin);
userRouter.route("/logout").post(verifyJWT, userLogout);
userRouter.route("/save/drawing").post(verifyJWT, userDrawing);
userRouter.route("/get/drawings").get(verifyJWT, getDrawings);
userRouter.route("/delete/drawing/data/complete/:userID").post(verifyJWT, deleteCompleteDrawingData);

export default userRouter;