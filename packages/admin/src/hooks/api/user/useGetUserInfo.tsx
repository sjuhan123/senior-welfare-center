import { type UseQueryOptions, useQuery } from '@tanstack/react-query';
import type { UserResponse } from '@common/shared';
import { END_POINT } from '../../../constant/endpoint';
import { get } from '../../../libs/api';
import { QUERY_KEYS } from '../../../constant/queryKeys';

export const getUserInfo = () => get<UserResponse>(END_POINT.USER);

const useGetUserInfo = (options?: UseQueryOptions<UserResponse>) => {
  return useQuery<UserResponse>({
    queryKey: [QUERY_KEYS.USER_INFO],
    queryFn: getUserInfo,
    ...options,
  });
};

export default useGetUserInfo;
