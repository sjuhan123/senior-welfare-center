import axios from "axios";
import jwt from "jsonwebtoken";
import { saveUser } from "./user.model.js";

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

    const accessToken = kakaoAccessTokenRes.data.access_token;

    const userInfo = await axios.get("https://kapi.kakao.com/v2/user/me", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/x-www-form-urlencoded;charset=utf-8",
      },
    });

    const { id, kakao_account } = userInfo.data;

    await saveUser(id, kakao_account);

    const JWTTOKEN = jwt.sign(
      {
        accessToken,
        id,
        userName: kakao_account.profile.nickname,
        userAvatar: kakao_account.profile.thumbnail_image_url,
      },
      process.env.JWT_SECRET_KEY
    );

    return JWTTOKEN;
  } catch (error) {
    console.error("Error retrieving districts:", error);
  }
}

async function postAuthKakaoLogout(accessToken) {
  try {
    const logoutRes = await axios.post(
      "https://kapi.kakao.com/v1/user/logout",
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return logoutRes;
  } catch (error) {
    console.error("로그아웃 실패:", error);
  }
}

export { postAuthKakao, postAuthKakaoLogout };
