import Enrollment from './enrollment.mongo.js';

async function hasAcceptedEnrollment(courseId, userId) {
  const enrollment = await Enrollment.findOne({ course: courseId, userId, state: 'accepted' });
  return !!enrollment;
}

export { hasAcceptedEnrollment };
