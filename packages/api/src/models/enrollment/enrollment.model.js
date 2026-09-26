import Enrollment from './enrollment.mongo.js';

async function hasAcceptedEnrollment(courseId, userId) {
  const enrollment = await Enrollment.findOne({ course: courseId, userId, state: 'accepted' });
  return !!enrollment;
}

async function getEnrollmentsByCourse(courseId) {
  return await Enrollment.find({ course: courseId }).sort({ createdAt: -1 });
}

async function updateEnrollmentState(enrollmentId, state) {
  return await Enrollment.findByIdAndUpdate(enrollmentId, { state }, { new: true });
}

async function updateEnrollmentsState(enrollmentIds, state) {
  await Enrollment.updateMany({ _id: { $in: enrollmentIds } }, { state });
}

async function dropAcceptedEnrollments(courseId) {
  await Enrollment.updateMany({ course: courseId, state: 'accepted' }, { state: 'dropped' });
}

async function deleteEnrollmentsByCourse(courseId) {
  await Enrollment.deleteMany({ course: courseId });
}

export {
  hasAcceptedEnrollment,
  getEnrollmentsByCourse,
  updateEnrollmentState,
  updateEnrollmentsState,
  dropAcceptedEnrollments,
  deleteEnrollmentsByCourse,
};
