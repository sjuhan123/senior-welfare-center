import { getRoomById } from '../models/room/room.model.js';
import { canAccessRoom } from '../services/room.service.js';

const requireRoomAccess = async (req, res, next) => {
  const { roomId } = req.params;
  const room = await getRoomById(roomId);

  if (!room) {
    return res.status(404).json({ statusCode: 404, message: '해당 대화방을 찾을 수 없습니다' });
  }

  if (!(await canAccessRoom(req.user, room))) {
    return res.status(403).json({ statusCode: 403, message: '권한이 없습니다' });
  }

  req.room = room;
  next();
};

export { requireRoomAccess };
