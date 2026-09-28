import { rotateRefreshToken, revokeRefreshToken } from '../../models/refreshToken/refreshToken.model.js';
import { findUserBy, saveUser } from '../../models/user/user.model.js';
import { issueAccessToken, issueAuthTokens, sendAuthTokens, clearAuthCookies } from '../../services/auth.service.js';

const DEV_TEST_USER_ID = 'dev-test-user';

async function refresh(req, res, clientType) {
  const refreshToken = clientType === 'admin' ? req.cookies?.refreshToken : req.body.refreshToken;

  if (!refreshToken) {
    return res.status(401).json({ statusCode: 401, message: 'Refresh token이 없습니다' });
  }

  const rotated = await rotateRefreshToken(refreshToken, clientType);

  if (!rotated) {
    return res.status(403).json({ statusCode: 403, message: '유효하지 않은 refresh token' });
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
    return res.status(500).json({ statusCode: 500, message: '서버 오류', error: error.message });
  }
}

async function httpPostMobileRefresh(req, res) {
  try {
    return await refresh(req, res, 'mobile');
  } catch (error) {
    console.error('Error refreshing mobile token:', error);
    return res.status(500).json({ statusCode: 500, message: '서버 오류', error: error.message });
  }
}

async function httpPostAdminLogout(req, res) {
  try {
    const refreshToken = req.cookies?.refreshToken;

    if (refreshToken) {
      await revokeRefreshToken(refreshToken);
    }

    clearAuthCookies(res);

    return res.status(200).json({ statusCode: 200, message: '로그아웃 성공' });
  } catch (error) {
    console.error('Error logging out admin:', error);
    return res.status(500).json({ statusCode: 500, message: '서버 오류', error: error.message });
  }
}

/** 카카오 로그인을 우회해서 고정 테스트 유저로 로그인 토큰을 발급함. Expo Go에서 카카오 네이티브 SDK가 동작하지 않아 로그인 이후 화면을 테스트할 수 없는 문제를 위한 개발 전용 경로. 43. 개발용 테스트 로그인 참고. */
async function httpPostDevLogin(req, res) {
  if (process.env.NODE_ENV === 'production') {
    return res.status(404).end();
  }

  try {
    const userName = '개발용 테스트 계정';
    const userAvatar = '';

    await saveUser(DEV_TEST_USER_ID, { profile: { nickname: userName, thumbnail_image_url: userAvatar } }, '');

    const tokens = await issueAuthTokens({ id: DEV_TEST_USER_ID, userName, userAvatar }, 'mobile');

    return sendAuthTokens(res, 'mobile', tokens);
  } catch (error) {
    console.error('Error issuing dev login token:', error);
    return res.status(500).json({ statusCode: 500, message: '서버 오류', error: error.message });
  }
}

export { httpPostAdminRefresh, httpPostMobileRefresh, httpPostAdminLogout, httpPostDevLogin };
