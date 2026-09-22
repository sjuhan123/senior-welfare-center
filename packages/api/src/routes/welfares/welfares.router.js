import express from 'express';

import {
  httpGetAllWelfares,
  httpGetClosestWelfare,
  httpPostWelfareInviteCode,
  httpGetWelfareInviteCode,
  httpGetWelfare,
  httpPatchWelfare,
} from './welfares.controller.js';
import { httpGetWelfareMemberships, httpPatchMembership } from '../memberships/memberships.controller.js';
import { httpGetMeals, httpPutMeal, httpDeleteMeal } from '../meals/meals.controller.js';
import { authenticateToken } from '../../middlewares/user.middleware.js';
import { requireWelfareRole, requireActiveMembership } from '../../middlewares/welfare.middleware.js';

const welfaresRouter = express.Router();
const requireWelfareAdmin = requireWelfareRole(['admin', 'super']);

welfaresRouter.get('/', httpGetAllWelfares);
welfaresRouter.get('/closest', httpGetClosestWelfare);
welfaresRouter.get('/:welfareId', authenticateToken, requireWelfareAdmin, httpGetWelfare);
welfaresRouter.patch('/:welfareId', authenticateToken, requireWelfareAdmin, httpPatchWelfare);
welfaresRouter.post('/:welfareId/invite-code', authenticateToken, requireWelfareAdmin, httpPostWelfareInviteCode);
welfaresRouter.get('/:welfareId/invite-code', authenticateToken, requireWelfareAdmin, httpGetWelfareInviteCode);
welfaresRouter.get('/:welfareId/memberships', authenticateToken, requireWelfareAdmin, httpGetWelfareMemberships);
welfaresRouter.patch('/:welfareId/memberships/:membershipId', authenticateToken, requireWelfareAdmin, httpPatchMembership);
welfaresRouter.get('/:welfareId/meals', authenticateToken, requireActiveMembership, httpGetMeals);
welfaresRouter.put('/:welfareId/meals/:date', authenticateToken, requireWelfareAdmin, httpPutMeal);
welfaresRouter.delete('/:welfareId/meals/:mealId', authenticateToken, requireWelfareAdmin, httpDeleteMeal);

export default welfaresRouter;
