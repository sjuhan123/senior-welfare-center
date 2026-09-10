import express from 'express';

import { httpGetAllWelfares, httpGetClosestWelfare, httpPostWelfareInviteCode, httpGetWelfareInviteCode } from './welfares.controller.js';
import { httpGetWelfareMemberships, httpPatchMembership } from '../memberships/memberships.controller.js';
import { authenticateToken } from '../../middlewares/user.middleware.js';
import { requireWelfareRole } from '../../middlewares/welfare.middleware.js';

const welfaresRouter = express.Router();
const requireWelfareAdmin = requireWelfareRole(['admin', 'super']);

welfaresRouter.get('/', httpGetAllWelfares);
welfaresRouter.get('/closest', httpGetClosestWelfare);
welfaresRouter.post('/:welfareId/invite-code', authenticateToken, requireWelfareAdmin, httpPostWelfareInviteCode);
welfaresRouter.get('/:welfareId/invite-code', authenticateToken, requireWelfareAdmin, httpGetWelfareInviteCode);
welfaresRouter.get('/:welfareId/memberships', authenticateToken, requireWelfareAdmin, httpGetWelfareMemberships);
welfaresRouter.patch('/:welfareId/memberships/:membershipId', authenticateToken, requireWelfareAdmin, httpPatchMembership);

export default welfaresRouter;
