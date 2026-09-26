import {
  createMembership,
  getMembershipsByUserId,
  getWelfareMembershipsPage,
  updateMembership,
  deactivateMembership,
} from '../../models/membership/membership.model.js';
import { findActiveInviteCodeByCode, incrementScanCount } from '../../models/welfareInviteCode/welfareInviteCode.model.js';

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
    const { filter = 'all', search = '', sort = 'desc', page = 1, limit = 20 } = req.query;

    const { members, total } = await getWelfareMembershipsPage(welfareId, {
      filter,
      search,
      sort,
      page: Number(page),
      limit: Number(limit),
    });

    const jsonResponse = {
      statusCode: 200,
      message: '복지관 회원 목록 조회 성공',
      data: { members, total },
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
    const { role, active, updatedAt } = req.body;

    const fields = {};
    if (role) {
      fields.role = role;
      fields.status = 'approved';
    }
    if (typeof active === 'boolean') {
      fields.active = active;
    }

    const { result, doc } = await updateMembership(membershipId, updatedAt, fields);

    if (result === 'not_found') {
      return res.status(404).json({ statusCode: 404, message: '해당 멤버십을 찾을 수 없습니다' });
    }

    if (result === 'conflict') {
      return res.status(409).json({ statusCode: 409, message: '다른 관리자가 이미 변경했습니다' });
    }

    const jsonResponse = {
      statusCode: 200,
      message: '회원 정보 변경 성공',
      data: doc,
    };
    return res.status(200).json(jsonResponse);
  } catch (error) {
    console.error('Error updating membership:', error);
    return res.status(500).json({
      statusCode: 500,
      message: '서버 오류',
      error: error.message,
    });
  }
}

async function httpDeleteMembership(req, res) {
  try {
    const userId = req.user.id;
    const { membershipId } = req.params;

    const deactivated = await deactivateMembership(userId, membershipId);

    if (!deactivated) {
      return res.status(404).json({
        statusCode: 404,
        message: '해당 멤버십을 찾을 수 없습니다',
      });
    }

    const jsonResponse = {
      statusCode: 200,
      message: '복지관 탈퇴 성공',
    };
    return res.status(200).json(jsonResponse);
  } catch (error) {
    console.error('Error deactivating membership:', error);
    return res.status(500).json({
      statusCode: 500,
      message: '서버 오류',
      error: error.message,
    });
  }
}

export { httpPostMembershipScan, httpGetMyMemberships, httpGetWelfareMemberships, httpPatchMembership, httpDeleteMembership };
