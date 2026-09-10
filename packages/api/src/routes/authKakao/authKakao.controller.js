import { postAuthKakaoByAccessToken } from '../../models/authKakao.model.js';
import {
  issueAuthTokens,
  sendAuthTokens,
} from '../../services/auth.service.js';

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

export { httpPostAuthKakao };
