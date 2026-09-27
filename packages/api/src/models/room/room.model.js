import Room from './room.mongo.js';

async function getRoomById(roomId) {
  return await Room.findById(roomId);
}

async function createRoom({ welfare, course, type, availableFrom, availableTo }) {
  return await Room.create({ welfare, course, type, availableFrom, availableTo });
}

async function updateRoom(roomId, { availableFrom, availableTo }) {
  return await Room.findByIdAndUpdate(roomId, { availableFrom, availableTo }, { new: true });
}

async function getRoomsByWelfare(welfareId) {
  return await Room.find({ welfare: welfareId });
}

async function getRoomsByCourse(courseId) {
  return await Room.find({ course: courseId });
}

async function deleteRoomsByCourse(courseId) {
  await Room.deleteMany({ course: courseId });
}

export { getRoomById, createRoom, updateRoom, getRoomsByWelfare, getRoomsByCourse, deleteRoomsByCourse };
