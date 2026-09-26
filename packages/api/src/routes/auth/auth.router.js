import express from 'express';

import { httpPostAdminRefresh, httpPostMobileRefresh, httpPostAdminLogout } from './auth.controller.js';

const authRouter = express.Router();

/** 액세스 토큰 갱신 */
authRouter.post('/admin/refresh', httpPostAdminRefresh);
authRouter.post('/mobile/refresh', httpPostMobileRefresh);

/** 로그아웃 */
authRouter.post('/admin/logout', httpPostAdminLogout);

export default authRouter;
