import express from 'express';

import { httpPostMembershipScan, httpGetMyMemberships, httpDeleteMembership } from './memberships.controller.js';

const membershipsRouter = express.Router();

membershipsRouter.post('/scan', httpPostMembershipScan);
membershipsRouter.get('/me', httpGetMyMemberships);
membershipsRouter.delete('/:membershipId', httpDeleteMembership);

export default membershipsRouter;
