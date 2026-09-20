import { useQuery } from '@tanstack/react-query';
import type { MembershipListResponse } from '@common/shared';
import { QUERY_KEYS } from '../constant/queryKeys';
import { getMemberships } from './api/membership/useGetMemberships';

const useMyMembership = () => {
  return useQuery({
    queryKey: [QUERY_KEYS.MEMBERSHIPS],
    queryFn: getMemberships,
    select: (memberships: MembershipListResponse) =>
      memberships.data.find(m => (m.role === 'admin' || m.role === 'super') && m.status === 'approved'),
  });
};

export default useMyMembership;
