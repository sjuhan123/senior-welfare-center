import { useQuery } from '@tanstack/react-query';
import type { MemberFilter, WelfareMemberListResponse } from '@common/shared';
import { END_POINT } from '../../../constant/endpoint';
import { get } from '../../../libs/api';
import { QUERY_KEYS } from '../../../constant/queryKeys';

export type WelfareMembersParams = {
  filter: MemberFilter;
  search: string;
  sort: 'asc' | 'desc';
  page: number;
  limit: number;
};

export const getWelfareMembers = (welfareId: string, params: WelfareMembersParams) =>
  get<WelfareMemberListResponse>(`${END_POINT.WELFARES}/${welfareId}/memberships`, { params });

const useGetWelfareMembers = (welfareId: string, params: WelfareMembersParams) => {
  return useQuery({
    queryKey: [QUERY_KEYS.MEMBERSHIPS, welfareId, params],
    queryFn: () => getWelfareMembers(welfareId, params),
  });
};

export default useGetWelfareMembers;
