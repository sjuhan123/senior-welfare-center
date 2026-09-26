import Course from './course.mongo.js';
import { updateWithVersionCheck } from '../../utils/versionedUpdate.js';

async function getCourseById(courseId) {
  return await Course.findById(courseId);
}

async function getCoursesByWelfare(welfareId) {
  return await Course.find({ welfare: welfareId, endedAt: null }).sort({ createdAt: -1 });
}

async function createCourse(welfareId, { name, when, place, cap, from, to, teacher }) {
  return await Course.create({ welfare: welfareId, name, when, place, cap, from, to, teacher });
}

async function updateCourse(courseId, expectedUpdatedAt, fields) {
  return await updateWithVersionCheck(Course, courseId, expectedUpdatedAt, fields);
}

async function markCourseEnded(courseId) {
  return await Course.findByIdAndUpdate(courseId, { endedAt: new Date() }, { new: true });
}

async function getExpiredCourses() {
  return await Course.find({ endedAt: null, to: { $lt: new Date() } });
}

async function getPurgeableCourses() {
  const threeMonthsAgo = new Date();
  threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);
  return await Course.find({ endedAt: { $ne: null, $lte: threeMonthsAgo } });
}

async function deleteCourseDoc(courseId) {
  await Course.findByIdAndDelete(courseId);
}

export { getCourseById, getCoursesByWelfare, createCourse, updateCourse, markCourseEnded, getExpiredCourses, getPurgeableCourses, deleteCourseDoc };
