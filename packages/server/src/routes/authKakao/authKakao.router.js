import express from "express";
import { httpPostAuthKakao } from "./authKakao.controller.js";

const authKakaoRouter = express.Router();

authKakaoRouter.get("/", httpPostAuthKakao);

export default authKakaoRouter;
