import express from "express";

import welfaresRouter from "./welfares/welfares.router.js";
import districtsRouter from "./districts/districts.router.js";
import authKakaoRouter from "./authKakao/authKakao.router.js";
import { authenticateToken } from "../middlewares/user.middleware.js";
import userRouter from "./user/user.router.js";

const api = express.Router();

api.use("/welfares", welfaresRouter);
api.use("/districts", districtsRouter);
api.use("/auth/kakao", authKakaoRouter);
api.use("/user", authenticateToken, userRouter);

export default api;
