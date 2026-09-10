import { createMembership, getMembershipsByUserId, getMembershipsByWelfareId, approveMembership } from '../../models/membership.model.js';
import { findActiveInviteCodeByCode, incrementScanCount } from '../../models/welfareInviteCode.model.js';

async function httpPostMembershipScan(req, res) {
  try {
    const userId = req.user.id;
    const { code } = req.body;

    const inviteCode = await findActiveInviteCodeByCode(code);

    if (!inviteCode) {
      return res.status(404).json({
        statusCode: 404,
        message: '유효하지 않은 QR입니다',
      });
    }

    const membership = await createMembership(userId, inviteCode.welfare._id, 'qr');
    await incrementScanCount(inviteCode._id);

    const jsonResponse = {
      statusCode: 201,
      message: '복지관 가입 성공',
      data: { membership, welfare: inviteCode.welfare },
    };
    return res.status(201).json(jsonResponse);
  } catch (error) {
    console.error('Error scanning welfare invite code:', error);
    return res.status(500).json({
      statusCode: 500,
      message: '서버 오류',
      error: error.message,
    });
  }
}

async function httpGetMyMemberships(req, res) {
  try {
    const userId = req.user.id;

    const memberships = await getMembershipsByUserId(userId);

    const jsonResponse = {
      statusCode: 200,
      message: '내 복지관 목록 조회 성공',
      data: memberships,
    };
    return res.status(200).json(jsonResponse);
  } catch (error) {
    console.error('Error retrieving memberships:', error);
    return res.status(500).json({
      statusCode: 500,
      message: '서버 오류',
      error: error.message,
    });
  }
}

async function httpGetWelfareMemberships(req, res) {
  try {
    const { welfareId } = req.params;
    const { status } = req.query;

    const memberships = await getMembershipsByWelfareId(welfareId, status);

    const jsonResponse = {
      statusCode: 200,
      message: '복지관 회원 목록 조회 성공',
      data: memberships,
    };
    return res.status(200).json(jsonResponse);
  } catch (error) {
    console.error('Error retrieving welfare memberships:', error);
    return res.status(500).json({
      statusCode: 500,
      message: '서버 오류',
      error: error.message,
    });
  }
}

async function httpPatchMembership(req, res) {
  try {
    const { membershipId } = req.params;
    const { role } = req.body;

    const membership = await approveMembership(membershipId, role);

    const jsonResponse = {
      statusCode: 200,
      message: '회원 승인 성공',
      data: membership,
    };
    return res.status(200).json(jsonResponse);
  } catch (error) {
    console.error('Error approving membership:', error);
    return res.status(500).json({
      statusCode: 500,
      message: '서버 오류',
      error: error.message,
    });
  }
}

export { httpPostMembershipScan, httpGetMyMemberships, httpGetWelfareMemberships, httpPatchMembership };
