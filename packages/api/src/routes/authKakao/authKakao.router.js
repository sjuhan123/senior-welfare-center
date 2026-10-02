import express from 'express';
import { httpPostAuthKakao, httpPostAuthKakaoAdmin } from './authKakao.controller.js';

const authKakaoRouter = express.Router();

/** 카카오 로그인(모바일/어드민) */
authKakaoRouter.post('/', httpPostAuthKakao);
authKakaoRouter.post('/admin', httpPostAuthKakaoAdmin);

export default authKakaoRouter;
