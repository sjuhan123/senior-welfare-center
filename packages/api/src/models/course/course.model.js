import Course from './course.mongo.js';

async function getCourseById(courseId) {
  return await Course.findById(courseId);
}

export { getCourseById };
