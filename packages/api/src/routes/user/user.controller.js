import {
  bookmarkWelfare,
  unBookmarkWelfare,
  deleteUser,
  updateUserCustomAvatar,
  getUserAvatarsByIds,
} from '../../models/user/user.model.js';
import { deleteMembershipsByUserId } from '../../models/membership/membership.model.js';
import { revokeRefreshToken, revokeAllRefreshTokens } from '../../models/refreshToken/refreshToken.model.js';
import { createAvatarPresignedUpload } from '../../services/upload.service.js';

async function httpGetUserInfo(req, res) {
  try {
    const userInfo = req.user.toObject();
    delete userInfo.kakaoAccessToken;

    const jsonResponse = {
      statusCode: 200,
      message: '유저 정보 조회 성공',
      data: userInfo,
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

async function httpPostUserLogout(req, res) {
  try {
    const { refreshToken } = req.body;

    if (refreshToken) {
      await revokeRefreshToken(refreshToken);
    }

    const jsonResponse = {
      statusCode: 200,
      message: '로그아웃 성공',
    };
    return res.status(200).json(jsonResponse);
  } catch (error) {
    console.error('Error logging out:', error);
    return res.status(500).json({
      statusCode: 500,
      message: '서버 오류',
      error: error.message,
    });
  }
}

async function httpPostUserBookmarkWelfare(req, res) {
  try {
    const userId = req.user.id;
    const welfareId = req.query.welfareId;

    const bookmarkedWelfareId = await bookmarkWelfare(userId, welfareId);

    if (bookmarkedWelfareId) {
      const jsonResponse = {
        statusCode: 200,
        message: `${bookmarkedWelfareId} 복지관 북마크 추가 성공`,
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

async function httpDeleteUserBookmarkWelfare(req, res) {
  try {
    const userId = req.user.id;
    const welfareId = req.query.welfareId;

    const bookmarkedWelfareId = await unBookmarkWelfare(userId, welfareId);

    if (bookmarkedWelfareId) {
      const jsonResponse = {
        statusCode: 200,
        message: '복지관 북마크 삭제 성공',
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

async function httpDeleteUser(req, res) {
  try {
    const userId = req.user.id;

    await deleteUser(userId);
    await deleteMembershipsByUserId(userId);
    await revokeAllRefreshTokens(userId);

    const jsonResponse = {
      statusCode: 200,
      message: '계정 삭제 성공',
    };
    return res.status(200).json(jsonResponse);
  } catch (error) {
    console.error('Error deleting user:', error);
    return res.status(500).json({
      statusCode: 500,
      message: '서버 오류',
      error: error.message,
    });
  }
}

async function httpPostAvatarPresign(req, res) {
  try {
    const { contentType } = req.body;

    const presigned = await createAvatarPresignedUpload(req.user.id, contentType);
    if (!presigned) {
      return res.status(400).json({ statusCode: 400, message: '지원하지 않는 이미지 형식입니다' });
    }

    return res.status(200).json({
      statusCode: 200,
      message: '업로드 URL 발급 성공',
      data: presigned,
    });
  } catch (error) {
    console.error('Error creating avatar presigned upload:', error);
    return res.status(500).json({
      statusCode: 500,
      message: '서버 오류',
      error: error.message,
    });
  }
}

async function httpPatchUserAvatar(req, res) {
  try {
    const { customAvatar } = req.body;

    await updateUserCustomAvatar(req.user.id, customAvatar);

    return res.status(200).json({
      statusCode: 200,
      message: '프로필 사진 변경 성공',
      data: { customAvatar },
    });
  } catch (error) {
    console.error('Error updating user avatar:', error);
    return res.status(500).json({
      statusCode: 500,
      message: '서버 오류',
      error: error.message,
    });
  }
}

async function httpPostUserAvatars(req, res) {
  try {
    const { ids } = req.body;
    const userIds = Array.isArray(ids) ? ids : [];

    const users = await getUserAvatarsByIds(userIds);

    return res.status(200).json({
      statusCode: 200,
      message: '아바타 조회 성공',
      data: users,
    });
  } catch (error) {
    console.error('Error retrieving user avatars:', error);
    return res.status(500).json({
      statusCode: 500,
      message: '서버 오류',
      error: error.message,
    });
  }
}

export {
  httpGetUserInfo,
  httpPostUserLogout,
  httpPostUserBookmarkWelfare,
  httpDeleteUserBookmarkWelfare,
  httpDeleteUser,
  httpPostAvatarPresign,
  httpPatchUserAvatar,
  httpPostUserAvatars,
};
