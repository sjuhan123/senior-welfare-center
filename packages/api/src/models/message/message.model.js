import Message from './message.mongo.js';
import { updateWithVersionCheck } from '../../utils/versionedUpdate.js';

async function getMessageById(messageId) {
  return await Message.findById(messageId);
}

async function getMessagesByRoom(roomId, { before, limit = 30 } = {}) {
  const filter = { room: roomId, ...(before && { createdAt: { $lt: before } }) };
  return await Message.find(filter).sort({ createdAt: -1 }).limit(limit);
}

async function getLatestMessagesByRooms(roomIds) {
  return await Message.aggregate([
    { $match: { room: { $in: roomIds } } },
    { $sort: { createdAt: -1 } },
    { $group: { _id: '$room', message: { $first: '$$ROOT' } } },
  ]);
}

async function createMessage({ room, senderId, senderName, senderRole, text, photos, editable }) {
  return await Message.create({ room, senderId, senderName, senderRole, text, photos, editable });
}

async function updateMessage(messageId, expectedUpdatedAt, fields) {
  return await updateWithVersionCheck(Message, messageId, expectedUpdatedAt, fields);
}

async function hideMessage(messageId) {
  return await Message.findByIdAndUpdate(messageId, { hidden: true }, { new: true });
}

async function toggleHeart(messageId, userId) {
  const message = await Message.findById(messageId);
  const update = message.hearts.includes(userId) ? { $pull: { hearts: userId } } : { $addToSet: { hearts: userId } };
  return await Message.findByIdAndUpdate(messageId, update, { new: true });
}

async function countMessagesSince(roomId, since) {
  const filter = { room: roomId, ...(since && { createdAt: { $gt: since } }) };
  return await Message.countDocuments(filter);
}

export { getMessageById, getMessagesByRoom, getLatestMessagesByRooms, createMessage, updateMessage, hideMessage, toggleHeart, countMessagesSince };
