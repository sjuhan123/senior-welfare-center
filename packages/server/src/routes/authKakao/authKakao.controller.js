import { postAuthKakao } from "../../models/authKakao.model.js";

async function httpPostAuthKakao(req, res) {
  const { code } = req.query;

  try {
    const JWTTOKEN = await postAuthKakao(code);
    const jsonResponse = {
      statusCode: 200,
      message: "카카오 로그인 성공",
      data: JWTTOKEN,
    };
    return res.status(200).json(jsonResponse);
  } catch (error) {
    console.error("Error retrieving districts:", error);
    return res.status(500).json({
      statusCode: 500,
      message: "서버 오류",
      error: error.message,
    });
  }
}

export { httpPostAuthKakao };
