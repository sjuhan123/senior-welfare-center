import express from 'express';

import { httpPostMembershipScan, httpGetMyMemberships } from './memberships.controller.js';

const membershipsRouter = express.Router();

membershipsRouter.post('/scan', httpPostMembershipScan);
membershipsRouter.get('/me', httpGetMyMemberships);

export default membershipsRouter;
