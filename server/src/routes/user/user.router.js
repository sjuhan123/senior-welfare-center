import express from "express";

import { httpGetUserInfo, httpPostUserLogout } from "./user.controller.js";

const userRouter = express.Router();

userRouter.get("/", httpGetUserInfo);
userRouter.post("/logout", httpPostUserLogout);

export default userRouter;
