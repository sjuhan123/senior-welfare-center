import express from 'express';

import {
  httpPostAdminRefresh,
  httpPostMobileRefresh,
} from './auth.controller.js';

const authRouter = express.Router();

authRouter.post('/admin/refresh', httpPostAdminRefresh);
authRouter.post('/mobile/refresh', httpPostMobileRefresh);

export default authRouter;
