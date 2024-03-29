import jwt from 'jsonwebtoken';
import { findUserBy } from '../models/user.model.js';

const authenticateToken = async (req, res, next) => {
  const tokenHeader = req.header('Authorization');

  if (!tokenHeader) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const token = tokenHeader.replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);

    req.token = decoded.accessToken;
    req.user = await findUserBy(decoded.id);

    next();
  } catch (error) {
    return res.status(403).json({ message: 'Invalid token' });
  }
};

export { authenticateToken };
