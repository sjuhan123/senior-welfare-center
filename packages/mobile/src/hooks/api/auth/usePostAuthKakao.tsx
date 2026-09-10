import { END_POINT } from '../../../constant/endpoint';
import { post } from '../../../libs/api';

type Response = {
  status: number;
  message: string;
  data: { accessToken: string; refreshToken: string };
};

export const postAuthKakao = (kakaoAccessToken: string) => post<Response>(END_POINT.KAKAO_LOGIN, { kakaoAccessToken });
