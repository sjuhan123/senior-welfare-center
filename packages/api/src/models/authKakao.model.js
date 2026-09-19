import axios from 'axios';
import { saveUser } from './user.model.js';

async function getKakaoUserInfo(kakaoAccessToken) {
  const userInfo = await axios.get('https://kapi.kakao.com/v2/user/me', {
    headers: {
      Authorization: `Bearer ${kakaoAccessToken}`,
      'Content-Type': 'application/x-www-form-urlencoded;charset=utf-8',
    },
  });

  const { id, kakao_account } = userInfo.data;

  await saveUser(id, kakao_account, kakaoAccessToken);

  return {
    id,
    userName: kakao_account.profile.nickname,
    userAvatar: kakao_account.profile.thumbnail_image_url,
  };
}

// 모바일: 네이티브 SDK가 이미 발급한 카카오 access token을 그대로 사용
async function postAuthKakaoByAccessToken(kakaoAccessToken) {
  try {
    return await getKakaoUserInfo(kakaoAccessToken);
  } catch (error) {
    console.error('Error retrieving kakao user info:', error);
  }
}

// 어드민(예정): 브라우저 리다이렉트로 받은 code를 client_secret과 함께 교환
async function postAuthKakaoByCode(code) {
  try {
    const kakaoAccessTokenRes = await axios.post(
      'https://kauth.kakao.com/oauth/token',
      {
        grant_type: 'authorization_code',
        client_id: process.env.KAKAO_REST_API_KEY,
        client_secret: process.env.KAKAO_CLIENT_SECRET,
        code,
        redirect_uri: process.env.KAKAO_REDIRECT_URI,
      },
      {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      },
    );

    return await getKakaoUserInfo(kakaoAccessTokenRes.data.access_token);
  } catch (error) {
    console.error('Error exchanging kakao code:', error);
  }
}

export { postAuthKakaoByAccessToken, postAuthKakaoByCode };
