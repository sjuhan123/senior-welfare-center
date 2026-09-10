import { UseQueryOptions, useQuery } from '@tanstack/react-query';
import { END_POINT } from '../../../constant/endpoint';
import { get } from '../../../libs/api';
import { QUERY_KEYS } from '../../../constant/queryKeys';
import type { MembershipListResponse } from '@common/shared';

export const getMemberships = () => get<MembershipListResponse>(END_POINT.MEMBERSHIPS_ME);

const useGetMemberships = (options?: UseQueryOptions<MembershipListResponse>) => {
  return useQuery<MembershipListResponse>({
    queryKey: [QUERY_KEYS.MEMBERSHIPS],
    queryFn: getMemberships,
    ...options,
  });
};

export default useGetMemberships;
