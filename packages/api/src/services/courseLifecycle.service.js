import { getExpiredCourses, getPurgeableCourses, markCourseEnded, deleteCourseDoc } from '../models/course/course.model.js';
import { dropAcceptedEnrollments, deleteEnrollmentsByCourse } from '../models/enrollment/enrollment.model.js';
import { getRoomsByCourse, deleteRoomsByCourse } from '../models/room/room.model.js';
import { getMessageIdsByRooms, deleteMessagesByRooms } from '../models/message/message.model.js';
import { deleteCommentsByMessages } from '../models/comment/comment.model.js';

async function endCourse(courseId) {
  await markCourseEnded(courseId);
  await dropAcceptedEnrollments(courseId);
}

async function endExpiredCourses() {
  const courses = await getExpiredCourses();
  for (const course of courses) {
    await endCourse(course._id);
  }
}

async function purgeCourse(courseId) {
  const rooms = await getRoomsByCourse(courseId);
  const roomIds = rooms.map(room => room._id);
  const messageIds = await getMessageIdsByRooms(roomIds);

  await deleteCommentsByMessages(messageIds);
  await deleteMessagesByRooms(roomIds);
  await deleteRoomsByCourse(courseId);
  await deleteEnrollmentsByCourse(courseId);
  await deleteCourseDoc(courseId);
}

async function purgeExpiredCourses() {
  const courses = await getPurgeableCourses();
  for (const course of courses) {
    await purgeCourse(course._id);
  }
}

export { endCourse, endExpiredCourses, purgeCourse, purgeExpiredCourses };
