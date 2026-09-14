import express from 'express';
import { httpPostAuthKakao, httpPostAuthKakaoAdmin } from './authKakao.controller.js';

const authKakaoRouter = express.Router();

authKakaoRouter.post('/', httpPostAuthKakao);
authKakaoRouter.post('/admin', httpPostAuthKakaoAdmin);

export default authKakaoRouter;
