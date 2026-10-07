import express from 'express';

import welfaresRouter from './welfares/welfares.router.js';
import districtsRouter from './districts/districts.router.js';
import authKakaoRouter from './authKakao/authKakao.router.js';
import authRouter from './auth/auth.router.js';
import { authenticateToken } from '../middlewares/user.middleware.js';
import userRouter from './user/user.router.js';
import membershipsRouter from './memberships/memberships.router.js';
import { generalRateLimit, authRateLimit } from '../middlewares/rateLimit.middleware.js';

const api = express.Router();

api.use(generalRateLimit);

api.use('/welfares', welfaresRouter);
api.use('/districts', districtsRouter);
api.use('/auth/kakao', authRateLimit, authKakaoRouter);
api.use('/auth', authRateLimit, authRouter);
api.use('/user', authenticateToken, userRouter);
api.use('/memberships', authenticateToken, membershipsRouter);

export default api;
