import mongoose from 'mongoose';
import Enrollment from './enrollment.mongo.js';

async function hasRoomAccessAsEnrollee(courseId, userId, roomType) {
  const enrollment = await Enrollment.findOne({ course: courseId, userId, state: 'accepted' });
  if (!enrollment) return false;
  return !enrollment.leftRoomTypes.includes(roomType);
}

async function leaveRoomType(courseId, userId, roomType) {
  await Enrollment.updateOne({ course: courseId, userId, state: 'accepted' }, { $addToSet: { leftRoomTypes: roomType } });
}

async function rejoinRoomType(courseId, userId, roomType) {
  await Enrollment.updateOne({ course: courseId, userId, state: 'accepted' }, { $pull: { leftRoomTypes: roomType } });
}

async function getAcceptedEnrollmentsByCourse(courseId) {
  return await Enrollment.aggregate([
    { $match: { course: new mongoose.Types.ObjectId(courseId), state: 'accepted' } },
    { $sort: { createdAt: -1 } },
    { $lookup: { from: 'users', localField: 'userId', foreignField: 'id', as: 'user' } },
    { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
    { $project: { _id: 1, userId: 1, userName: '$user.userName', leftRoomTypes: 1 } },
  ]);
}

async function getPendingEnrollmentCountsByWelfare(welfareId) {
  return await Enrollment.aggregate([
    { $match: { state: 'pending' } },
    { $lookup: { from: 'courses', localField: 'course', foreignField: '_id', as: 'course' } },
    { $unwind: '$course' },
    { $match: { 'course.welfare': new mongoose.Types.ObjectId(welfareId), 'course.endedAt': null } },
    { $group: { _id: '$course._id', courseName: { $first: '$course.name' }, count: { $sum: 1 } } },
    { $project: { _id: 0, courseId: '$_id', courseName: 1, count: 1 } },
  ]);
}

async function getMyEnrollmentsByWelfare(welfareId, userId) {
  return await Enrollment.aggregate([
    { $match: { userId } },
    { $lookup: { from: 'courses', localField: 'course', foreignField: '_id', as: 'course' } },
    { $unwind: '$course' },
    { $match: { 'course.welfare': new mongoose.Types.ObjectId(welfareId) } },
    { $project: { _id: 1, course: '$course._id', state: 1 } },
  ]);
}

async function createEnrollment(courseId, userId) {
  const existing = await Enrollment.findOne({ course: courseId, userId, state: { $in: ['pending', 'accepted'] } });
  if (existing) return { result: 'conflict' };

  const doc = await Enrollment.create({ course: courseId, userId, state: 'pending' });
  return { result: 'ok', doc };
}

async function cancelMyEnrollment(courseId, userId) {
  const enrollment = await Enrollment.findOne({ course: courseId, userId, state: { $in: ['pending', 'accepted'] } });
  if (!enrollment) return { result: 'not_found' };

  if (enrollment.state === 'pending') {
    await Enrollment.deleteOne({ _id: enrollment._id });
  } else {
    await Enrollment.updateOne({ _id: enrollment._id }, { state: 'dropped' });
  }

  return { result: 'ok' };
}

async function getEnrollmentsByCourse(courseId) {
  return await Enrollment.aggregate([
    { $match: { course: new mongoose.Types.ObjectId(courseId) } },
    { $sort: { createdAt: -1 } },
    { $lookup: { from: 'users', localField: 'userId', foreignField: 'id', as: 'user' } },
    { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } },
    { $project: { _id: 1, course: 1, userId: 1, userName: '$user.userName', state: 1, createdAt: 1, updatedAt: 1 } },
  ]);
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
  hasRoomAccessAsEnrollee,
  leaveRoomType,
  rejoinRoomType,
  getAcceptedEnrollmentsByCourse,
  getPendingEnrollmentCountsByWelfare,
  getMyEnrollmentsByWelfare,
  createEnrollment,
  cancelMyEnrollment,
  getEnrollmentsByCourse,
  updateEnrollmentState,
  updateEnrollmentsState,
  dropAcceptedEnrollments,
  deleteEnrollmentsByCourse,
};
