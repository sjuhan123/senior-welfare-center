import { rotateRefreshToken } from '../../models/refreshToken.model.js';
import { findUserBy } from '../../models/user.model.js';
import {
  issueAccessToken,
  sendAuthTokens,
} from '../../services/auth.service.js';

async function refresh(req, res, clientType) {
  const refreshToken =
    clientType === 'admin' ? req.cookies?.refreshToken : req.body.refreshToken;

  if (!refreshToken) {
    return res
      .status(401)
      .json({ statusCode: 401, message: 'Refresh token이 없습니다' });
  }

  const rotated = await rotateRefreshToken(refreshToken, clientType);

  if (!rotated) {
    return res
      .status(403)
      .json({ statusCode: 403, message: '유효하지 않은 refresh token' });
  }

  const user = await findUserBy(rotated.userId);
  const accessToken = issueAccessToken({
    id: user.id,
    userName: user.userName,
    userAvatar: user.userAvatar,
  });

  return sendAuthTokens(res, clientType, {
    accessToken,
    refreshToken: rotated.refreshToken,
  });
}

async function httpPostAdminRefresh(req, res) {
  try {
    return await refresh(req, res, 'admin');
  } catch (error) {
    console.error('Error refreshing admin token:', error);
    return res
      .status(500)
      .json({ statusCode: 500, message: '서버 오류', error: error.message });
  }
}

async function httpPostMobileRefresh(req, res) {
  try {
    return await refresh(req, res, 'mobile');
  } catch (error) {
    console.error('Error refreshing mobile token:', error);
    return res
      .status(500)
      .json({ statusCode: 500, message: '서버 오류', error: error.message });
  }
}

export { httpPostAdminRefresh, httpPostMobileRefresh };
