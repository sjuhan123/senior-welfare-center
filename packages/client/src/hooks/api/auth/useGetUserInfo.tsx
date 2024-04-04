import { END_POINT } from '../../../constant/endpoint';
import { get } from '../../../libs/api';
import { UseQueryOptions, useQuery } from 'react-query';
import { User } from '../../../types/user';
import { QUERY_KEYS } from '../../../constant/queryKeys';

type Response = {
  status: number;
  message: string;
  data: User;
};

export const getUserInfo = () => get<Response>(END_POINT.USER);

const useGetUserInfo = (options?: UseQueryOptions<Response>) => {
  return useQuery<Response>({
    queryKey: [QUERY_KEYS.USER_INFO],
    queryFn: getUserInfo,
    ...options,
  });
};

export default useGetUserInfo;
