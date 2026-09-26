import { getRoomById } from '../models/room/room.model.js';
import { getMessageById, createMessage, hideMessage, toggleHeart } from '../models/message/message.model.js';
import { createComment } from '../models/comment/comment.model.js';
import { markRoomRead } from '../models/roomRead/roomRead.model.js';
import { canAccessRoom, canSendToRoom, canModerateRoom, getSenderRole } from '../services/room.service.js';

function registerRoomSocketEvents(io, socket) {
  socket.on('join_room', async ({ roomId }, callback) => {
    try {
      const room = await getRoomById(roomId);
      if (!room || !(await canAccessRoom(socket.user, room))) {
        return callback?.({ error: '권한이 없습니다' });
      }

      socket.join(roomId);
      await markRoomRead(roomId, socket.user.id);
      callback?.({ ok: true });
    } catch (error) {
      callback?.({ error: '서버 오류' });
    }
  });

  socket.on('leave_room', async ({ roomId }, callback) => {
    try {
      socket.leave(roomId);
      await markRoomRead(roomId, socket.user.id);
      callback?.({ ok: true });
    } catch (error) {
      callback?.({ error: '서버 오류' });
    }
  });

  socket.on('send_message', async ({ roomId, text, photos }, callback) => {
    try {
      const room = await getRoomById(roomId);
      if (!room || !(await canSendToRoom(socket.user, room))) {
        return callback?.({ error: '권한이 없습니다' });
      }

      const message = await createMessage({
        room: roomId,
        senderId: socket.user.id,
        senderName: socket.user.userName,
        senderRole: await getSenderRole(socket.user.id, room.welfare),
        text,
        photos,
        editable: room.type === 'notice',
      });

      io.to(roomId).emit('new_message', message);
      callback?.({ ok: true, data: message });
    } catch (error) {
      callback?.({ error: '서버 오류' });
    }
  });

  socket.on('hide_message', async ({ messageId }, callback) => {
    try {
      const message = await getMessageById(messageId);
      if (!message) return callback?.({ error: '해당 메시지를 찾을 수 없습니다' });

      const room = await getRoomById(message.room);
      if (!room || !(await canModerateRoom(socket.user, room))) {
        return callback?.({ error: '권한이 없습니다' });
      }

      await hideMessage(messageId);
      io.to(room._id.toString()).emit('message_hidden', { messageId });
      callback?.({ ok: true });
    } catch (error) {
      callback?.({ error: '서버 오류' });
    }
  });

  socket.on('toggle_heart', async ({ messageId }, callback) => {
    try {
      const message = await getMessageById(messageId);
      if (!message) return callback?.({ error: '해당 메시지를 찾을 수 없습니다' });

      const room = await getRoomById(message.room);
      if (!room || !(await canSendToRoom(socket.user, room))) {
        return callback?.({ error: '권한이 없습니다' });
      }

      const updated = await toggleHeart(messageId, socket.user.id);
      io.to(room._id.toString()).emit('heart_updated', { messageId, hearts: updated.hearts });
      callback?.({ ok: true });
    } catch (error) {
      callback?.({ error: '서버 오류' });
    }
  });

  socket.on('add_comment', async ({ messageId, text }, callback) => {
    try {
      const message = await getMessageById(messageId);
      if (!message) return callback?.({ error: '해당 메시지를 찾을 수 없습니다' });

      const room = await getRoomById(message.room);
      if (!room || !(await canSendToRoom(socket.user, room))) {
        return callback?.({ error: '권한이 없습니다' });
      }

      const comment = await createComment({ message: messageId, userId: socket.user.id, text });
      io.to(room._id.toString()).emit('new_comment', comment);
      callback?.({ ok: true, data: comment });
    } catch (error) {
      callback?.({ error: '서버 오류' });
    }
  });
}

export { registerRoomSocketEvents };
