import { END_POINT } from '../../../constant/endpoint';
import { post } from '../../../libs/api';

type Response = {
  statusCode: number;
  message: string;
  data: { accessToken: string; refreshToken: string };
};

export const postAuthDevLogin = () => post<Response>(END_POINT.AUTH_DEV_LOGIN);
