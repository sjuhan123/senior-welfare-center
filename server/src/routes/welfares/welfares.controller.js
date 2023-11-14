import welfares from "../../models/welfares.model.js";

function getAllWelfares(req, res) {
  return res.status(200).json({
    statusCode: 200,
    message: "복지관 목록 조회 성공",
    data: welfares,
  });
}

export { getAllWelfares };
