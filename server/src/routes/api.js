import express from "express";

import welfaresRouter from "./welfares/welfares.router.js";
import districtsRouter from "./districts/districts.router.js";
import authKakaoRouter from "./authKakao/authKakao.router.js";

const api = express.Router();

api.use("/welfares", welfaresRouter);
api.use("/districts", districtsRouter);
api.use("/auth/kakao", authKakaoRouter);

export default api;
