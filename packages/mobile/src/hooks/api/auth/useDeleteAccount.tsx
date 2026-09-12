import { END_POINT } from '../../../constant/endpoint';
import { del } from '../../../libs/api';

type Response = {
  statusCode: number;
  message: string;
};

export const deleteAccount = () => del<Response>(END_POINT.USER);
