import {
  getAllWelfares,
  getWelfaresByDistrictId,
} from "../../models/welfares.model.js";
import { calculateDistance } from "../../utils/index.js";

async function httpGetAllWelfares(req, res) {
  try {
    const { districtId } = req.query;

    if (districtId) {
      const welfaresData = await getWelfaresByDistrictId(districtId);
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

async function httpGetClosestWelfare(req, res) {
  try {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        statusCode: 400,
        message: "Latitude and longitude are required",
      });
    }

    const welfaresData = await getAllWelfares();

    const sortedWelfares = welfaresData
      .map((welfare) => ({
        ...welfare,
        distance: calculateDistance(
          latitude,
          longitude,
          welfare.latitude,
          welfare.longitude
        ),
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 2);

    const jsonResponse = {
      statusCode: 200,
      message: "가장 가까운 복지관 2곳 조회 성공",
      data: sortedWelfares,
    };
    return res.status(200).json(jsonResponse);
  } catch (error) {
    console.error("Error retrieving welfares:", error);
    return res.status(500).json({
      statusCode: 500,
      message: "서버 오류",
      error: error.message,
    });
  }
}

export { httpGetAllWelfares, httpGetClosestWelfare };
