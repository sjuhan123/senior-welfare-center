import axios from "axios";
import jwt from "jsonwebtoken";

async function postAuthKakao(code) {
  try {
    const kakaoAccessTokenRes = await axios.post(
      "https://kauth.kakao.com/oauth/token",
      {
        grant_type: "authorization_code",
        client_id: process.env.KAKAO_REST_API_KEY,
        code,
        redirect_uri: process.env.KAKAO_REDIRECT_URI,
      },
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    );

    const userInfo = await axios.get("https://kapi.kakao.com/v2/user/me", {
      headers: {
        Authorization: `Bearer ${kakaoAccessTokenRes.data.access_token}`,
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    });

    const { id, kakao_account } = userInfo.data;

    const JWTTOKEN = jwt.sign(
      {
        id,
        nickname: kakao_account.profile.nickname,
        picture: kakao_account.profile.thumbnail_image_url,
      },
      process.env.JWT_SECRET_KEY
    );

    return JWTTOKEN;
  } catch (error) {
    console.error("Error retrieving districts:", error);
  }
}

export { postAuthKakao };
