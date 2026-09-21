import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { MembershipRole } from '@common/shared';
import { END_POINT } from '../../../constant/endpoint';
import { patch } from '../../../libs/api';
import { QUERY_KEYS } from '../../../constant/queryKeys';

export const updateMemberRole = (welfareId: string, membershipId: string, role: MembershipRole) =>
  patch(`${END_POINT.WELFARES}/${welfareId}/memberships/${membershipId}`, { role });

const useUpdateMemberRole = (welfareId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ membershipId, role }: { membershipId: string; role: MembershipRole }) => updateMemberRole(welfareId, membershipId, role),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MEMBERSHIPS, welfareId] });
    },
  });
};

export default useUpdateMemberRole;
