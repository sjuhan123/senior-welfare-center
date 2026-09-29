import { getRoomById, getRoomsByWelfare, updateRoom } from '../../models/room/room.model.js';
import { getMessagesByRoom, getLatestMessagesByRooms, createMessage, updateMessage, hideMessage } from '../../models/message/message.model.js';
import { getUnreadCount, markRoomRead } from '../../models/roomRead/roomRead.model.js';
import { leaveRoomType, rejoinRoomType, getAcceptedEnrollmentsByCourse } from '../../models/enrollment/enrollment.model.js';
import { getCourseById } from '../../models/course/course.model.js';
import { findUserBy } from '../../models/user/user.model.js';
import { canAccessRoom, canSendToRoom, canModerateRoom, getSenderRole } from '../../services/room.service.js';

async function httpGetRooms(req, res) {
  try {
    const { welfareId } = req.params;

    const rooms = await getRoomsByWelfare(welfareId);
    const accessFlags = await Promise.all(rooms.map(room => canAccessRoom(req.user, room)));
    const accessibleRooms = rooms.filter((room, index) => accessFlags[index]);

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

    /** 공지방은 소켓 join_room을 안 써서 여기가 유일한 "방에 들어감" 시점. REST 조회 자체를 읽음 처리로 취급. */
    await markRoomRead(roomId, req.user.id);

    const [canSend, canManage] = await Promise.all([canSendToRoom(req.user, req.room), canModerateRoom(req.user, req.room)]);

    return res.status(200).json({
      statusCode: 200,
      message: '메시지 목록 조회 성공',
      data: { messages, canSend, canManage },
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

async function httpPostMessage(req, res) {
  try {
    const { text } = req.body;

    if (req.room.type !== 'notice' || !(await canSendToRoom(req.user, req.room))) {
      return res.status(403).json({ statusCode: 403, message: '권한이 없습니다' });
    }
    if (!text || !text.trim()) {
      return res.status(400).json({ statusCode: 400, message: '공지 내용을 입력하세요' });
    }

    const message = await createMessage({
      room: req.room._id,
      senderId: req.user.id,
      senderName: req.user.userName,
      senderRole: await getSenderRole(req.user.id, req.room.welfare),
      text,
      photos: [],
      editable: true,
    });

    return res.status(201).json({
      statusCode: 201,
      message: '공지 등록 성공',
      data: message,
    });
  } catch (error) {
    console.error('Error creating message:', error);
    return res.status(500).json({
      statusCode: 500,
      message: '서버 오류',
      error: error.message,
    });
  }
}

async function httpDeleteMessage(req, res) {
  try {
    const { messageId } = req.params;

    if (!(await canModerateRoom(req.user, req.room))) {
      return res.status(403).json({ statusCode: 403, message: '권한이 없습니다' });
    }

    const message = await hideMessage(messageId);
    if (!message) {
      return res.status(404).json({ statusCode: 404, message: '해당 메시지를 찾을 수 없습니다' });
    }

    return res.status(200).json({
      statusCode: 200,
      message: '삭제 완료',
    });
  } catch (error) {
    console.error('Error hiding message:', error);
    return res.status(500).json({
      statusCode: 500,
      message: '서버 오류',
      error: error.message,
    });
  }
}

async function httpDeleteRoomMember(req, res) {
  try {
    const { roomId, userId } = req.params;

    const room = await getRoomById(roomId);
    if (!room) {
      return res.status(404).json({ statusCode: 404, message: '해당 대화방을 찾을 수 없습니다' });
    }
    if (!room.course) {
      return res.status(400).json({ statusCode: 400, message: '복지관 공지방은 내보내기를 지원하지 않습니다' });
    }

    await leaveRoomType(room.course, userId, room.type);

    return res.status(200).json({
      statusCode: 200,
      message: '내보내기 완료',
    });
  } catch (error) {
    console.error('Error removing room member:', error);
    return res.status(500).json({
      statusCode: 500,
      message: '서버 오류',
      error: error.message,
    });
  }
}

async function httpPostRoomMember(req, res) {
  try {
    const { roomId, userId } = req.params;

    const room = await getRoomById(roomId);
    if (!room) {
      return res.status(404).json({ statusCode: 404, message: '해당 대화방을 찾을 수 없습니다' });
    }
    if (!room.course) {
      return res.status(400).json({ statusCode: 400, message: '복지관 공지방은 재초대를 지원하지 않습니다' });
    }

    await rejoinRoomType(room.course, userId, room.type);

    return res.status(200).json({
      statusCode: 200,
      message: '재초대 완료',
    });
  } catch (error) {
    console.error('Error rejoining room member:', error);
    return res.status(500).json({
      statusCode: 500,
      message: '서버 오류',
      error: error.message,
    });
  }
}

async function httpGetRoomMembers(req, res) {
  try {
    const { roomId } = req.params;

    const room = await getRoomById(roomId);
    if (!room) {
      return res.status(404).json({ statusCode: 404, message: '해당 대화방을 찾을 수 없습니다' });
    }
    if (!room.course) {
      return res.status(400).json({ statusCode: 400, message: '복지관 공지방은 참여 회원 조회를 지원하지 않습니다' });
    }

    const course = await getCourseById(room.course);
    const teacherUser = course.teacher ? await findUserBy(course.teacher) : null;
    const teacher = teacherUser ? { userId: course.teacher, userName: teacherUser.userName } : null;

    const enrollments = await getAcceptedEnrollmentsByCourse(room.course);
    const active = [];
    const left = [];
    for (const enrollment of enrollments) {
      const entry = { enrollmentId: enrollment._id, userId: enrollment.userId, userName: enrollment.userName };
      if (enrollment.leftRoomTypes.includes(room.type)) left.push(entry);
      else active.push(entry);
    }

    return res.status(200).json({
      statusCode: 200,
      message: '참여 회원 조회 성공',
      data: { teacher, active, left },
    });
  } catch (error) {
    console.error('Error retrieving room members:', error);
    return res.status(500).json({
      statusCode: 500,
      message: '서버 오류',
      error: error.message,
    });
  }
}

async function httpPatchRoom(req, res) {
  try {
    const { roomId } = req.params;
    const { availableFrom, availableTo } = req.body;

    const room = await updateRoom(roomId, { availableFrom, availableTo });
    if (!room) {
      return res.status(404).json({ statusCode: 404, message: '해당 대화방을 찾을 수 없습니다' });
    }

    return res.status(200).json({
      statusCode: 200,
      message: '이용 시간 수정 성공',
      data: room,
    });
  } catch (error) {
    console.error('Error updating room:', error);
    return res.status(500).json({
      statusCode: 500,
      message: '서버 오류',
      error: error.message,
    });
  }
}

export {
  httpGetRooms,
  httpGetRoomMessages,
  httpPostMessage,
  httpPatchMessage,
  httpDeleteMessage,
  httpDeleteRoomMember,
  httpPostRoomMember,
  httpGetRoomMembers,
  httpPatchRoom,
};
