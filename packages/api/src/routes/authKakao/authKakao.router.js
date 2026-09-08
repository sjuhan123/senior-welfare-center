import express from 'express';
import { httpPostAuthKakao } from './authKakao.controller.js';

const authKakaoRouter = express.Router();

authKakaoRouter.post('/', httpPostAuthKakao);

export default authKakaoRouter;
