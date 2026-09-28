import express from 'express';

import { httpPostAdminRefresh, httpPostMobileRefresh, httpPostAdminLogout, httpPostDevLogin } from './auth.controller.js';

const authRouter = express.Router();

/** 액세스 토큰 갱신 */
authRouter.post('/admin/refresh', httpPostAdminRefresh);
authRouter.post('/mobile/refresh', httpPostMobileRefresh);

/** 로그아웃 */
authRouter.post('/admin/logout', httpPostAdminLogout);

/** 개발 전용: 카카오 로그인 우회 (NODE_ENV=production이면 404) */
authRouter.post('/dev/login', httpPostDevLogin);

export default authRouter;
