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
import { httpGetLostItems, httpPostLostItem, httpPatchLostItem, httpDeleteLostItem } from '../lostItems/lostItems.controller.js';
import { httpGetRooms, httpGetRoomMessages, httpPatchMessage } from '../rooms/rooms.controller.js';
import {
  httpGetCourses,
  httpPostCourse,
  httpPatchCourse,
  httpDeleteCourse,
  httpGetEnrollments,
  httpPatchEnrollment,
  httpPatchEnrollmentsBulk,
} from '../courses/courses.controller.js';
import { authenticateToken } from '../../middlewares/user.middleware.js';
import { requireWelfareRole, requireActiveMembership } from '../../middlewares/welfare.middleware.js';
import { requireRoomAccess } from '../../middlewares/room.middleware.js';

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
welfaresRouter.get('/:welfareId/lost-items', authenticateToken, requireActiveMembership, httpGetLostItems);
welfaresRouter.post('/:welfareId/lost-items', authenticateToken, requireWelfareAdmin, httpPostLostItem);
welfaresRouter.patch('/:welfareId/lost-items/:lostItemId', authenticateToken, requireWelfareAdmin, httpPatchLostItem);
welfaresRouter.delete('/:welfareId/lost-items/:lostItemId', authenticateToken, requireWelfareAdmin, httpDeleteLostItem);
welfaresRouter.get('/:welfareId/rooms', authenticateToken, httpGetRooms);
welfaresRouter.get('/:welfareId/rooms/:roomId/messages', authenticateToken, requireRoomAccess, httpGetRoomMessages);
welfaresRouter.patch('/:welfareId/rooms/:roomId/messages/:messageId', authenticateToken, requireRoomAccess, httpPatchMessage);
welfaresRouter.get('/:welfareId/courses', authenticateToken, requireWelfareAdmin, httpGetCourses);
welfaresRouter.post('/:welfareId/courses', authenticateToken, requireWelfareAdmin, httpPostCourse);
welfaresRouter.patch('/:welfareId/courses/:courseId', authenticateToken, requireWelfareAdmin, httpPatchCourse);
welfaresRouter.delete('/:welfareId/courses/:courseId', authenticateToken, requireWelfareAdmin, httpDeleteCourse);
welfaresRouter.get('/:welfareId/courses/:courseId/enrollments', authenticateToken, requireWelfareAdmin, httpGetEnrollments);
welfaresRouter.patch('/:welfareId/courses/:courseId/enrollments', authenticateToken, requireWelfareAdmin, httpPatchEnrollmentsBulk);
welfaresRouter.patch('/:welfareId/courses/:courseId/enrollments/:enrollmentId', authenticateToken, requireWelfareAdmin, httpPatchEnrollment);

export default welfaresRouter;
