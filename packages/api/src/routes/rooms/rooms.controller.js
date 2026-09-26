import { getRoomsByWelfare } from '../../models/room/room.model.js';
import { getMessagesByRoom, getLatestMessagesByRooms, updateMessage } from '../../models/message/message.model.js';
import { getUnreadCount } from '../../models/roomRead/roomRead.model.js';
import { canAccessRoom, canSendToRoom } from '../../services/room.service.js';

async function httpGetRooms(req, res) {
  try {
    const { welfareId } = req.params;

    const rooms = await getRoomsByWelfare(welfareId);
    const accessibleRooms = [];
    for (const room of rooms) {
      if (await canAccessRoom(req.user, room)) accessibleRooms.push(room);
    }

    const roomIds = accessibleRooms.map(room => room._id);
    const latestMessages = await getLatestMessagesByRooms(roomIds);
    const latestMessageByRoom = new Map(latestMessages.map(entry => [entry._id.toString(), entry.message]));

    const data = await Promise.all(
      accessibleRooms.map(async room => ({
        room,
        latestMessage: latestMessageByRoom.get(room._id.toString()) ?? null,
        unreadCount: await getUnreadCount(room._id, req.user.id),
      })),
    );

    return res.status(200).json({
      statusCode: 200,
      message: '대화방 목록 조회 성공',
      data,
    });
  } catch (error) {
    console.error('Error retrieving rooms:', error);
    return res.status(500).json({
      statusCode: 500,
      message: '서버 오류',
      error: error.message,
    });
  }
}

async function httpGetRoomMessages(req, res) {
  try {
    const { roomId } = req.params;
    const { before, limit } = req.query;

    const messages = await getMessagesByRoom(roomId, {
      before: before ? new Date(before) : undefined,
      limit: limit ? Number(limit) : undefined,
    });

    return res.status(200).json({
      statusCode: 200,
      message: '메시지 목록 조회 성공',
      data: messages,
    });
  } catch (error) {
    console.error('Error retrieving room messages:', error);
    return res.status(500).json({
      statusCode: 500,
      message: '서버 오류',
      error: error.message,
    });
  }
}

async function httpPatchMessage(req, res) {
  try {
    const { messageId } = req.params;
    const { text, updatedAt } = req.body;

    if (req.room.type !== 'notice' || !(await canSendToRoom(req.user, req.room))) {
      return res.status(403).json({ statusCode: 403, message: '권한이 없습니다' });
    }

    const { result, doc } = await updateMessage(messageId, updatedAt, { text });

    if (result === 'not_found') {
      return res.status(404).json({ statusCode: 404, message: '해당 메시지를 찾을 수 없습니다' });
    }

    if (result === 'conflict') {
      return res.status(409).json({ statusCode: 409, message: '다른 사람이 이미 수정했습니다' });
    }

    return res.status(200).json({
      statusCode: 200,
      message: '메시지 수정 성공',
      data: doc,
    });
  } catch (error) {
    console.error('Error updating message:', error);
    return res.status(500).json({
      statusCode: 500,
      message: '서버 오류',
      error: error.message,
    });
  }
}

export { httpGetRooms, httpGetRoomMessages, httpPatchMessage };
