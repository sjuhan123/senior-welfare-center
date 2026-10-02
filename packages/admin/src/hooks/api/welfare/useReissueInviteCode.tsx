import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { InviteCodeIssueResponse } from '@common/shared';
import { END_POINT } from '../../../constant/endpoint';
import { post } from '../../../libs/api';
import { QUERY_KEYS } from '../../../constant/queryKeys';

export const reissueInviteCode = (welfareId: string) => post<InviteCodeIssueResponse>(`${END_POINT.WELFARES}/${welfareId}/invite-code`);

const useReissueInviteCode = (welfareId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () => reissueInviteCode(welfareId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.INVITE_CODE, welfareId] });
    },
  });
};

export default useReissueInviteCode;
