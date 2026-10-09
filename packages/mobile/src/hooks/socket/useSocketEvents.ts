import { useEffect } from 'react';
import { getSocket } from '../../libs/socket';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type Handlers = Record<string, (...args: any[]) => void>;

/** 소켓 이벤트 구독/해제 보일러플레이트. getHandlers는 effect가 실행될 때마다 새로 호출되어, 그 시점의 handlers를 등록/해제한다. */
const useSocketEvents = (getHandlers: () => Handlers, deps: unknown[]) => {
  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;

    const handlers = getHandlers();
    Object.entries(handlers).forEach(([event, handler]) => socket.on(event, handler));

    return () => {
      Object.entries(handlers).forEach(([event, handler]) => socket.off(event, handler));
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);
};

export default useSocketEvents;
