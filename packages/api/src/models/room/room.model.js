import Room from './room.mongo.js';

async function getRoomById(roomId) {
  return await Room.findById(roomId);
}

async function getRoomsByWelfare(welfareId) {
  return await Room.find({ welfare: welfareId });
}

export { getRoomById, getRoomsByWelfare };
