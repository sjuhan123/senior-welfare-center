import express from 'express';

import {
  httpDeleteUserBookmarkWelfare,
  httpGetUserInfo,
  httpPostUserBookmarkWelfare,
  httpPostUserLogout,
} from './user.controller.js';

const userRouter = express.Router();

userRouter.get('/', httpGetUserInfo);
userRouter.post('/logout', httpPostUserLogout);
userRouter.post('/welfare', httpPostUserBookmarkWelfare);
userRouter.delete('/welfare', httpDeleteUserBookmarkWelfare);

export default userRouter;
