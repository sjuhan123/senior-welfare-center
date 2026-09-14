import jwt from 'jsonwebtoken';

import {
  issueRefreshToken,
  REFRESH_TOKEN_TTL_MS,
} from '../models/refreshToken.model.js';

const ACCESS_TOKEN_EXPIRES_IN = '1h';
const ACCESS_TOKEN_MAX_AGE_MS = 60 * 60 * 1000;

function issueAccessToken(payload) {
  return jwt.sign(payload, process.env.JWT_SECRET_KEY, {
    expiresIn: ACCESS_TOKEN_EXPIRES_IN,
  });
}

async function issueAuthTokens(payload, clientType) {
  const accessToken = issueAccessToken(payload);
  const refreshToken = await issueRefreshToken(payload.id, clientType);

  return { accessToken, refreshToken };
}

function cookieOptions(maxAge) {
  return {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'strict' : 'lax',
    domain: process.env.COOKIE_DOMAIN,
    maxAge,
  };
}

function sendAuthTokens(res, clientType, { accessToken, refreshToken }) {
  if (clientType === 'admin') {
    res.cookie('token', accessToken, cookieOptions(ACCESS_TOKEN_MAX_AGE_MS));
    res.cookie(
      'refreshToken',
      refreshToken,
      cookieOptions(REFRESH_TOKEN_TTL_MS),
    );
    return res.status(200).json({ statusCode: 200, message: '로그인 성공' });
  }

  return res.status(200).json({
    statusCode: 200,
    message: '로그인 성공',
    data: { accessToken, refreshToken },
  });
}

export { issueAccessToken, issueAuthTokens, sendAuthTokens };
