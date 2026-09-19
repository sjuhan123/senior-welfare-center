import express from 'express';

import { httpPostAdminRefresh, httpPostMobileRefresh, httpPostAdminLogout } from './auth.controller.js';

const authRouter = express.Router();

authRouter.post('/admin/refresh', httpPostAdminRefresh);
authRouter.post('/mobile/refresh', httpPostMobileRefresh);
authRouter.post('/admin/logout', httpPostAdminLogout);

export default authRouter;
