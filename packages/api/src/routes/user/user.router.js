import express from 'express';

import {
  httpDeleteUserBookmarkWelfare,
  httpGetUserInfo,
  httpPostUserBookmarkWelfare,
  httpPostUserLogout,
  httpDeleteUser,
  httpPostAvatarPresign,
  httpPatchUserAvatar,
  httpPostUserAvatars,
} from './user.controller.js';

const userRouter = express.Router();

/** 내 정보 조회/탈퇴 */
userRouter.get('/', httpGetUserInfo);
userRouter.delete('/', httpDeleteUser);

/** 로그아웃 */
userRouter.post('/logout', httpPostUserLogout);

/** 프로필 사진 변경 */
userRouter.post('/avatar/presign-upload', httpPostAvatarPresign);
userRouter.patch('/avatar', httpPatchUserAvatar);

/** 보낸 사람 아바타 조회(대화방·사진방·댓글에서 사용, ID가 많아질 수 있어서 GET 쿼리스트링 대신 POST body로 받음) */
userRouter.post('/avatars', httpPostUserAvatars);

/** 북마크한 복지관 */
userRouter.post('/welfare', httpPostUserBookmarkWelfare);
userRouter.delete('/welfare', httpDeleteUserBookmarkWelfare);

export default userRouter;
