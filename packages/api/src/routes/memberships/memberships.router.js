import express from 'express';

import { httpPostMembershipScan, httpGetMyMemberships, httpDeleteMembership } from './memberships.controller.js';

const membershipsRouter = express.Router();

/** QR 스캔 가입 */
membershipsRouter.post('/scan', httpPostMembershipScan);

/** 내 복지관 멤버십 조회/탈퇴 */
membershipsRouter.get('/me', httpGetMyMemberships);
membershipsRouter.delete('/:membershipId', httpDeleteMembership);

export default membershipsRouter;
