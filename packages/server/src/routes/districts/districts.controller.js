import { getAllDistricts } from "../../models/districts.model.js";

async function httpGetAllDistricts(req, res) {
  try {
    const uniqueDistricts = await getAllDistricts();
    const jsonResponse = {
      statusCode: 200,
      message: "구 목록 조회 성공",
      data: uniqueDistricts,
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

export { httpGetAllDistricts };
