import { getAllWelfares, getWelfaresBy } from "../../models/welfares.model.js";

async function httpGetAllWelfares(req, res) {
  try {
    const { districtId } = req.query;

    if (districtId) {
      const welfaresData = await getWelfaresBy(districtId);
      const jsonResponse = {
        statusCode: 200,
        message: "복지관 목록 조회 성공",
        data: welfaresData,
      };
      return res.status(200).json(jsonResponse);
    } else {
      const welfaresData = await getAllWelfares();
      const jsonResponse = {
        statusCode: 200,
        message: "복지관 목록 조회 성공",
        data: welfaresData,
      };
      return res.status(200).json(jsonResponse);
    }
  } catch (error) {
    console.error("Error retrieving welfares:", error);
    return res.status(500).json({
      statusCode: 500,
      message: "서버 오류",
      error: error.message,
    });
  }
}

export { httpGetAllWelfares };
