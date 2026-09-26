import Comment from './comment.mongo.js';

async function getCommentsByMessage(messageId) {
  return await Comment.find({ message: messageId }).sort({ createdAt: 1 });
}

async function createComment({ message, userId, text }) {
  return await Comment.create({ message, userId, text });
}

async function deleteCommentsByMessages(messageIds) {
  await Comment.deleteMany({ message: { $in: messageIds } });
}

export { getCommentsByMessage, createComment, deleteCommentsByMessages };
