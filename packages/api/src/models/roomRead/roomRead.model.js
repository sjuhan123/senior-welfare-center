import RoomRead from './roomRead.mongo.js';
import { countMessagesSince } from '../message/message.model.js';

async function markRoomRead(roomId, userId) {
  await RoomRead.findOneAndUpdate({ room: roomId, userId }, { lastReadAt: new Date() }, { upsert: true });
}

async function getUnreadCount(roomId, userId) {
  const roomRead = await RoomRead.findOne({ room: roomId, userId });
  return await countMessagesSince(roomId, roomRead?.lastReadAt);
}

export { markRoomRead, getUnreadCount };
