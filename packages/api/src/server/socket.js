import { Server } from 'socket.io';
import { authenticateSocket } from '../middlewares/socketAuth.middleware.js';

function initSocket(httpServer) {
  const io = new Server(httpServer, {
    // app.js의 cors 설정과 동일한 origin 목록(어드민 로컬/원격 개발 + dev/운영 도메인)
    cors: {
      origin: ['http://localhost:5173', 'http://100.79.188.45:5173', 'https://dev.uri-bokji.com', 'https://uri-bokji.com'],
      credentials: true,
    },
  });

  io.use(authenticateSocket);

  return io;
}

export { initSocket };
