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

/** 복지관은 공공데이터로 일괄 시딩돼서 생성 시점에 공지방을 같이 만들 훅이 없음. 대신 조회 시점에 없으면 만듦(upsert). */
async function ensureWelfareNoticeRoom(welfareId) {
  await Room.findOneAndUpdate(
    { welfare: welfareId, course: null, type: 'notice' },
    { welfare: welfareId, course: null, type: 'notice' },
    { upsert: true },
  );
}

async function getRoomsByWelfare(welfareId) {
  await ensureWelfareNoticeRoom(welfareId);
  return await Room.find({ welfare: welfareId });
}

async function getRoomsByCourse(courseId) {
  return await Room.find({ course: courseId });
}

async function deleteRoomsByCourse(courseId) {
  await Room.deleteMany({ course: courseId });
}

export { getRoomById, createRoom, updateRoom, getRoomsByWelfare, getRoomsByCourse, deleteRoomsByCourse };
