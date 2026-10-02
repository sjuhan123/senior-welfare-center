import { io, type Socket } from 'socket.io-client';
import { getUserToken } from '../utills/persistentStorage';

let socket: Socket | null = null;

/** 앱 전역에서 소켓 연결은 1개만 유지 */
export function connectSocket(): Socket {
  if (socket) return socket;

  socket = io(process.env.EXPO_PUBLIC_BASE_URL || '', {
    auth: callback => {
      void getUserToken().then(token => callback({ token }));
    },
  });

  return socket;
}

export function disconnectSocket() {
  socket?.disconnect();
  socket = null;
}

export function getSocket(): Socket | null {
  return socket;
}
