import { getAllWelfares, getWelfaresByDistrictId, getWelfareByWelfareId, updateWelfare } from '../../models/welfares.model.js';
import { issueInviteCode, getActiveInviteCode, getInviteCodeHistory } from '../../models/welfareInviteCode.model.js';
import { calculateDistance } from '../../utils/index.js';

async function httpGetAllWelfares(req, res) {
  try {
    const { districtId } = req.query;

    if (districtId) {
      const welfaresData = await getWelfaresByDistrictId(districtId);
      const jsonResponse = {
        statusCode: 200,
        message: '복지관 목록 조회 성공',
        data: welfaresData,
      };
      return res.status(200).json(jsonResponse);
    } else {
      const welfaresData = await getAllWelfares();
      const jsonResponse = {
        statusCode: 200,
        message: '복지관 목록 조회 성공',
        data: welfaresData,
      };
      return res.status(200).json(jsonResponse);
    }
  } catch (error) {
    console.error('Error retrieving welfares:', error);
    return res.status(500).json({
      statusCode: 500,
      message: '서버 오류',
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
        message: 'Latitude and longitude are required',
      });
    }

    const welfaresData = await getAllWelfares();

    const sortedWelfares = welfaresData
      .map(welfare => ({
        ...welfare,
        distance: calculateDistance(latitude, longitude, welfare.latitude, welfare.longitude),
      }))
      .sort((a, b) => a.distance - b.distance)
      .slice(0, 2);

    const jsonResponse = {
      statusCode: 200,
      message: '가장 가까운 복지관 2곳 조회 성공',
      data: sortedWelfares,
    };
    return res.status(200).json(jsonResponse);
  } catch (error) {
    console.error('Error retrieving welfares:', error);
    return res.status(500).json({
      statusCode: 500,
      message: '서버 오류',
      error: error.message,
    });
  }
}

async function httpPostWelfareInviteCode(req, res) {
  try {
    const { welfareId } = req.params;

    const inviteCode = await issueInviteCode(welfareId);

    const jsonResponse = {
      statusCode: 201,
      message: 'QR 코드 발급 성공',
      data: inviteCode,
    };
    return res.status(201).json(jsonResponse);
  } catch (error) {
    console.error('Error issuing welfare invite code:', error);
    return res.status(500).json({
      statusCode: 500,
      message: '서버 오류',
      error: error.message,
    });
  }
}

async function httpGetWelfareInviteCode(req, res) {
  try {
    const { welfareId } = req.params;

    const [active, history] = await Promise.all([getActiveInviteCode(welfareId), getInviteCodeHistory(welfareId)]);

    const jsonResponse = {
      statusCode: 200,
      message: 'QR 코드 조회 성공',
      data: { active, history },
    };
    return res.status(200).json(jsonResponse);
  } catch (error) {
    console.error('Error retrieving welfare invite code:', error);
    return res.status(500).json({
      statusCode: 500,
      message: '서버 오류',
      error: error.message,
    });
  }
}

async function httpGetWelfare(req, res) {
  try {
    const { welfareId } = req.params;

    const welfare = await getWelfareByWelfareId(welfareId);

    const jsonResponse = {
      statusCode: 200,
      message: '복지관 조회 성공',
      data: welfare,
    };
    return res.status(200).json(jsonResponse);
  } catch (error) {
    console.error('Error retrieving welfare:', error);
    return res.status(500).json({
      statusCode: 500,
      message: '서버 오류',
      error: error.message,
    });
  }
}

async function httpPatchWelfare(req, res) {
  try {
    const { welfareId } = req.params;
    const { name, address, phone, homepage, remarks, updatedAt } = req.body;

    const { result, doc } = await updateWelfare(welfareId, updatedAt, { name, address, phone, homepage, remarks });

    if (result === 'not_found') {
      return res.status(404).json({ statusCode: 404, message: '해당 복지관을 찾을 수 없습니다' });
    }

    if (result === 'conflict') {
      return res.status(409).json({ statusCode: 409, message: '다른 관리자가 이미 수정했습니다' });
    }

    const jsonResponse = {
      statusCode: 200,
      message: '복지관 정보 수정 성공',
      data: doc,
    };
    return res.status(200).json(jsonResponse);
  } catch (error) {
    console.error('Error updating welfare:', error);
    return res.status(500).json({
      statusCode: 500,
      message: '서버 오류',
      error: error.message,
    });
  }
}

export { httpGetAllWelfares, httpGetClosestWelfare, httpPostWelfareInviteCode, httpGetWelfareInviteCode, httpGetWelfare, httpPatchWelfare };
