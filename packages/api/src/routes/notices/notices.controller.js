import { getRoomsByWelfare } from '../../models/room/room.model.js';
import { getCoursesByWelfare } from '../../models/course/course.model.js';
import { getNoticesByRooms, countMessagesSinceByRooms } from '../../models/message/message.model.js';

async function getNoticeRoomIds(welfareId) {
  const rooms = await getRoomsByWelfare(welfareId);
  return rooms.filter(room => room.type === 'notice').map(room => room._id);
}

async function httpGetNoticeCount(req, res) {
  try {
    const { welfareId } = req.params;
    const { since } = req.query;

    const roomIds = await getNoticeRoomIds(welfareId);
    const count = await countMessagesSinceByRooms(roomIds, since ? new Date(since) : undefined);

    return res.status(200).json({
      statusCode: 200,
      message: '공지 건수 조회 성공',
      data: { count },
    });
  } catch (error) {
    console.error('Error counting notices:', error);
    return res.status(500).json({
      statusCode: 500,
      message: '서버 오류',
      error: error.message,
    });
  }
}

async function httpGetNotices(req, res) {
  try {
    const { welfareId } = req.params;
    const { before, limit } = req.query;

    const rooms = await getRoomsByWelfare(welfareId);
    const noticeRooms = rooms.filter(room => room.type === 'notice');
    const roomIds = noticeRooms.map(room => room._id);

    const courses = await getCoursesByWelfare(welfareId);
    const courseNameById = new Map(courses.map(course => [course._id.toString(), course.name]));
    const roomLabelById = new Map(
      noticeRooms.map(room => [
        room._id.toString(),
        room.course ? `${courseNameById.get(room.course.toString()) ?? '삭제된 강좌'} 공지방` : '복지관 공지방',
      ]),
    );

    const messages = await getNoticesByRooms(roomIds, {
      before: before ? new Date(before) : undefined,
      limit: limit ? Number(limit) : undefined,
    });

    const data = messages.map(message => ({
      _id: message._id,
      room: message.room,
      roomLabel: roomLabelById.get(message.room.toString()) ?? '알 수 없음',
      text: message.text,
      createdAt: message.createdAt,
      updatedAt: message.updatedAt,
    }));

    return res.status(200).json({
      statusCode: 200,
      message: '공지 목록 조회 성공',
      data,
    });
  } catch (error) {
    console.error('Error retrieving notices:', error);
    return res.status(500).json({
      statusCode: 500,
      message: '서버 오류',
      error: error.message,
    });
  }
}

export { httpGetNotices, httpGetNoticeCount };
