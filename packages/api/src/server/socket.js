import { Server } from 'socket.io';
import { authenticateSocket } from '../middlewares/socketAuth.middleware.js';
import { registerRoomSocketEvents } from '../sockets/room.socket.js';
import { CORS_ORIGINS } from '../utils/corsOrigins.js';

function initSocket(httpServer) {
  const io = new Server(httpServer, {
    cors: {
      origin: CORS_ORIGINS,
      credentials: true,
    },
  });

  io.use(authenticateSocket);

  io.on('connection', socket => {
    registerRoomSocketEvents(io, socket);
  });

  return io;
}

export { initSocket };
