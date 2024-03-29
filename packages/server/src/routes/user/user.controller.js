import { postAuthKakaoLogout } from '../../models/authKakao.model.js';
import { bookmarkWelfare, unBookmarkWelfare } from '../../models/user.model.js';

async function httpGetUserInfo(req, res) {
  try {
    const userInfo = req.user;

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
    const userToken = req.token;

    const logoutRes = await postAuthKakaoLogout(userToken);

    if (logoutRes) {
      const jsonResponse = {
        statusCode: 200,
        message: '로그아웃 성공',
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

export {
  httpGetUserInfo,
  httpPostUserLogout,
  httpPostUserBookmarkWelfare,
  httpDeleteUserBookmarkWelfare,
};
