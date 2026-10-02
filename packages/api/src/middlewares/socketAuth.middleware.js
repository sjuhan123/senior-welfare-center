import jwt from 'jsonwebtoken';
import { parseCookie } from 'cookie';
import { findUserBy } from '../models/user/user.model.js';

async function authenticateSocket(socket, next) {
  const cookieHeader = socket.handshake.headers.cookie;
  const cookieToken = cookieHeader ? parseCookie(cookieHeader).token : undefined;
  const token = cookieToken || socket.handshake.auth?.token;

  if (!token) {
    return next(new Error('Unauthorized'));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    socket.user = await findUserBy(decoded.id);
    next();
  } catch (error) {
    next(new Error('Invalid token'));
  }
}

export { authenticateSocket };
