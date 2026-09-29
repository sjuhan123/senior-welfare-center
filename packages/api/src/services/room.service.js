import { getMembership } from '../models/membership/membership.model.js';
import { getCourseById } from '../models/course/course.model.js';
import { hasRoomAccessAsEnrollee } from '../models/enrollment/enrollment.model.js';

/** "오전 9:00"/"오후 6:00" 형식 문자열을 자정 기준 분(minutes)으로 변환 */
function parseKoreanTimeToMinutes(text) {
  const match = text.match(/(오전|오후)\s*(\d{1,2}):(\d{2})/);
  if (!match) return null;

  const [, period, hourText, minuteText] = match;
  const hour = (Number(hourText) % 12) + (period === '오후' ? 12 : 0);

  return hour * 60 + Number(minuteText);
}

/** availableFrom/availableTo가 없으면 시간 제한 없는 방(공지방 등) */
function isRoomAvailableNow(room) {
  if (!room.availableFrom || !room.availableTo) return true;

  const from = parseKoreanTimeToMinutes(room.availableFrom);
  const to = parseKoreanTimeToMinutes(room.availableTo);
  if (from === null || to === null) return true;

  const nowDate = new Date();
  const now = nowDate.getHours() * 60 + nowDate.getMinutes();

  if (from <= to) return now >= from && now < to;
  return now >= from || now < to;
}

async function canAccessRoom(user, room) {
  if (!room.course) {
    const membership = await getMembership(user.id, room.welfare);
    return !!membership && membership.active !== false;
  }

  const course = await getCourseById(room.course);
  if (course.endedAt) return false;
  if (course.teacher === user.id) return true;

  const membership = await getMembership(user.id, room.welfare);
  if (membership && ['admin', 'super'].includes(membership.role) && membership.active !== false) return true;

  return await hasRoomAccessAsEnrollee(room.course, user.id, room.type);
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

  if (!isRoomAvailableNow(room)) return false;

  return await hasRoomAccessAsEnrollee(room.course, user.id, room.type);
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
