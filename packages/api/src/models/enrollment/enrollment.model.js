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
  getEnrollmentsByCourse,
  updateEnrollmentState,
  updateEnrollmentsState,
  dropAcceptedEnrollments,
  deleteEnrollmentsByCourse,
};
