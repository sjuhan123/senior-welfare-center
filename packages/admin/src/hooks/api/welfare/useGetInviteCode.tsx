import { type UseQueryOptions, useQuery } from '@tanstack/react-query';
import type { InviteCodeResponse } from '@common/shared';
import { END_POINT } from '../../../constant/endpoint';
import { get } from '../../../libs/api';
import { QUERY_KEYS } from '../../../constant/queryKeys';

export const getInviteCode = (welfareId: string) => get<InviteCodeResponse>(`${END_POINT.WELFARES}/${welfareId}/invite-code`);

const useGetInviteCode = (welfareId: string, options?: UseQueryOptions<InviteCodeResponse>) => {
  return useQuery<InviteCodeResponse>({
    queryKey: [QUERY_KEYS.INVITE_CODE, welfareId],
    queryFn: () => getInviteCode(welfareId),
    ...options,
  });
};

export default useGetInviteCode;
