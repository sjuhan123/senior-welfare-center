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
import {
  httpGetRooms,
  httpGetRoomMessages,
  httpPostMessage,
  httpPatchMessage,
  httpDeleteMessage,
  httpDeleteRoomMember,
  httpPostRoomMember,
  httpGetRoomMembers,
  httpPatchRoom,
} from '../rooms/rooms.controller.js';
import { httpGetNotices, httpGetNoticeCount } from '../notices/notices.controller.js';
import {
  httpGetCourses,
  httpPostCourse,
  httpPatchCourse,
  httpDeleteCourse,
  httpGetCourseRooms,
  httpGetPendingEnrollmentCounts,
  httpGetMyEnrollments,
  httpPostEnrollment,
  httpDeleteMyEnrollment,
  httpGetEnrollments,
  httpPatchEnrollment,
  httpPatchEnrollmentsBulk,
} from '../courses/courses.controller.js';
import { authenticateToken } from '../../middlewares/user.middleware.js';
import { requireWelfareRole, requireActiveMembership } from '../../middlewares/welfare.middleware.js';
import { requireRoomAccess } from '../../middlewares/room.middleware.js';

const welfaresRouter = express.Router();
const requireWelfareAdmin = requireWelfareRole(['admin', 'super']);

/** 복지관 조회/수정 */
welfaresRouter.get('/', httpGetAllWelfares);
welfaresRouter.get('/closest', httpGetClosestWelfare);
welfaresRouter.get('/:welfareId', authenticateToken, requireWelfareAdmin, httpGetWelfare);
welfaresRouter.patch('/:welfareId', authenticateToken, requireWelfareAdmin, httpPatchWelfare);

/** 가입 초대코드(QR) */
welfaresRouter.post('/:welfareId/invite-code', authenticateToken, requireWelfareAdmin, httpPostWelfareInviteCode);
welfaresRouter.get('/:welfareId/invite-code', authenticateToken, requireWelfareAdmin, httpGetWelfareInviteCode);

/** 회원 관리 */
welfaresRouter.get('/:welfareId/memberships', authenticateToken, requireWelfareAdmin, httpGetWelfareMemberships);
welfaresRouter.patch('/:welfareId/memberships/:membershipId', authenticateToken, requireWelfareAdmin, httpPatchMembership);

/** 오늘의 밥 */
welfaresRouter.get('/:welfareId/meals', authenticateToken, requireActiveMembership, httpGetMeals);
welfaresRouter.put('/:welfareId/meals/:date', authenticateToken, requireWelfareAdmin, httpPutMeal);
welfaresRouter.delete('/:welfareId/meals/:mealId', authenticateToken, requireWelfareAdmin, httpDeleteMeal);

/** 분실물 관리 */
welfaresRouter.get('/:welfareId/lost-items', authenticateToken, requireActiveMembership, httpGetLostItems);
welfaresRouter.post('/:welfareId/lost-items', authenticateToken, requireWelfareAdmin, httpPostLostItem);
welfaresRouter.patch('/:welfareId/lost-items/:lostItemId', authenticateToken, requireWelfareAdmin, httpPatchLostItem);
welfaresRouter.delete('/:welfareId/lost-items/:lostItemId', authenticateToken, requireWelfareAdmin, httpDeleteLostItem);

/** 대화방·메시지 */
welfaresRouter.get('/:welfareId/rooms', authenticateToken, httpGetRooms);
welfaresRouter.get('/:welfareId/rooms/:roomId/messages', authenticateToken, requireRoomAccess, httpGetRoomMessages);
welfaresRouter.post('/:welfareId/rooms/:roomId/messages', authenticateToken, requireRoomAccess, httpPostMessage);
welfaresRouter.patch('/:welfareId/rooms/:roomId/messages/:messageId', authenticateToken, requireRoomAccess, httpPatchMessage);
welfaresRouter.delete('/:welfareId/rooms/:roomId/messages/:messageId', authenticateToken, requireRoomAccess, httpDeleteMessage);
welfaresRouter.get('/:welfareId/notices', authenticateToken, requireWelfareAdmin, httpGetNotices);
welfaresRouter.get('/:welfareId/notices/count', authenticateToken, requireWelfareAdmin, httpGetNoticeCount);
welfaresRouter.patch('/:welfareId/rooms/:roomId', authenticateToken, requireWelfareAdmin, httpPatchRoom);
welfaresRouter.get('/:welfareId/rooms/:roomId/members', authenticateToken, requireWelfareAdmin, httpGetRoomMembers);
welfaresRouter.delete('/:welfareId/rooms/:roomId/members/:userId', authenticateToken, requireWelfareAdmin, httpDeleteRoomMember);
welfaresRouter.post('/:welfareId/rooms/:roomId/members/:userId', authenticateToken, requireWelfareAdmin, httpPostRoomMember);

/** 강좌 관리 */
welfaresRouter.get('/:welfareId/courses', authenticateToken, requireActiveMembership, httpGetCourses);
welfaresRouter.post('/:welfareId/courses', authenticateToken, requireWelfareAdmin, httpPostCourse);
welfaresRouter.patch('/:welfareId/courses/:courseId', authenticateToken, requireWelfareAdmin, httpPatchCourse);
welfaresRouter.delete('/:welfareId/courses/:courseId', authenticateToken, requireWelfareAdmin, httpDeleteCourse);
welfaresRouter.get('/:welfareId/courses/:courseId/rooms', authenticateToken, requireWelfareAdmin, httpGetCourseRooms);
welfaresRouter.get('/:welfareId/enrollments/pending-count', authenticateToken, requireWelfareAdmin, httpGetPendingEnrollmentCounts);
welfaresRouter.get('/:welfareId/enrollments/mine', authenticateToken, requireActiveMembership, httpGetMyEnrollments);

/** 강좌 신청(회원) */
welfaresRouter.post('/:welfareId/courses/:courseId/enrollments', authenticateToken, requireActiveMembership, httpPostEnrollment);
welfaresRouter.delete('/:welfareId/courses/:courseId/enrollments/mine', authenticateToken, requireActiveMembership, httpDeleteMyEnrollment);

/** 강좌 신청자 관리(수락/거절/탈퇴) */
welfaresRouter.get('/:welfareId/courses/:courseId/enrollments', authenticateToken, requireWelfareAdmin, httpGetEnrollments);
welfaresRouter.patch('/:welfareId/courses/:courseId/enrollments', authenticateToken, requireWelfareAdmin, httpPatchEnrollmentsBulk);
welfaresRouter.patch('/:welfareId/courses/:courseId/enrollments/:enrollmentId', authenticateToken, requireWelfareAdmin, httpPatchEnrollment);

export default welfaresRouter;
