import { getMembership } from '../models/membership/membership.model.js';
import { getCourseById } from '../models/course/course.model.js';
import { hasAcceptedEnrollment } from '../models/enrollment/enrollment.model.js';

async function canAccessRoom(user, room) {
  if (!room.course) {
    const membership = await getMembership(user.id, room.welfare);
    return !!membership && membership.status === 'approved' && membership.active !== false;
  }

  const course = await getCourseById(room.course);
  if (course.endedAt) return false;
  if (course.teacher === user.id) return true;

  const membership = await getMembership(user.id, room.welfare);
  if (membership && ['admin', 'super'].includes(membership.role) && membership.active !== false) return true;

  return await hasAcceptedEnrollment(room.course, user.id);
}

async function canSendToRoom(user, room) {
  const course = room.course ? await getCourseById(room.course) : null;
  if (course?.endedAt) return false;

  if (room.type === 'notice') {
    if (course?.teacher === user.id) return true;
    const membership = await getMembership(user.id, room.welfare);
    return !!membership && ['admin', 'super'].includes(membership.role) && membership.active !== false;
  }

  if (course?.teacher === user.id) return true;

  const membership = await getMembership(user.id, room.welfare);
  if (membership && ['admin', 'super'].includes(membership.role) && membership.active !== false) return true;

  return await hasAcceptedEnrollment(room.course, user.id);
}

async function canModerateRoom(user, room) {
  const course = room.course ? await getCourseById(room.course) : null;
  if (course?.endedAt) return false;
  if (course?.teacher === user.id) return true;

  const membership = await getMembership(user.id, room.welfare);
  return !!membership && ['admin', 'super'].includes(membership.role) && membership.active !== false;
}

async function getSenderRole(userId, welfareId) {
  const membership = await getMembership(userId, welfareId);
  return membership?.role ?? 'member';
}

export { canAccessRoom, canSendToRoom, canModerateRoom, getSenderRole };
