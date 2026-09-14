import { postAuthKakaoByAccessToken, postAuthKakaoByCode } from '../../models/authKakao.model.js';
import { hasApprovedRole } from '../../models/membership.model.js';
import { issueAuthTokens, sendAuthTokens } from '../../services/auth.service.js';

async function httpPostAuthKakao(req, res) {
  const { kakaoAccessToken } = req.body;

  try {
    const user = await postAuthKakaoByAccessToken(kakaoAccessToken);
    const tokens = await issueAuthTokens(user, 'mobile');

    return sendAuthTokens(res, 'mobile', tokens);
  } catch (error) {
    console.error('Error authenticating with kakao:', error);
    return res.status(500).json({
      statusCode: 500,
      message: '서버 오류',
      error: error.message,
    });
  }
}

async function httpPostAuthKakaoAdmin(req, res) {
  const { code } = req.body;

  try {
    const user = await postAuthKakaoByCode(code);

    if (!user) {
      return res.status(401).json({
        statusCode: 401,
        message: '카카오 인증에 실패했습니다',
      });
    }

    const isAdmin = await hasApprovedRole(user.id, ['admin', 'super']);

    if (!isAdmin) {
      return res.status(403).json({
        statusCode: 403,
        message: '이 계정은 일반 회원입니다. 복지관 슈퍼관리자에게 관리자 권한 배정을 요청하세요.',
      });
    }

    const tokens = await issueAuthTokens(user, 'admin');

    return sendAuthTokens(res, 'admin', tokens);
  } catch (error) {
    console.error('Error authenticating admin with kakao:', error);
    return res.status(500).json({
      statusCode: 500,
      message: '서버 오류',
      error: error.message,
    });
  }
}

export { httpPostAuthKakao, httpPostAuthKakaoAdmin };
