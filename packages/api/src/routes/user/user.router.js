import express from 'express';

import {
  httpDeleteUserBookmarkWelfare,
  httpGetUserInfo,
  httpPostUserBookmarkWelfare,
  httpPostUserLogout,
  httpDeleteUser,
} from './user.controller.js';

const userRouter = express.Router();

/** 내 정보 조회/탈퇴 */
userRouter.get('/', httpGetUserInfo);
userRouter.delete('/', httpDeleteUser);

/** 로그아웃 */
userRouter.post('/logout', httpPostUserLogout);

/** 북마크한 복지관 */
userRouter.post('/welfare', httpPostUserBookmarkWelfare);
userRouter.delete('/welfare', httpDeleteUserBookmarkWelfare);

export default userRouter;
