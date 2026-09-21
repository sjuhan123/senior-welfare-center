import { useMutation, useQueryClient } from '@tanstack/react-query';
import { END_POINT } from '../../../constant/endpoint';
import { patch } from '../../../libs/api';
import { QUERY_KEYS } from '../../../constant/queryKeys';

export const setMemberActive = (welfareId: string, membershipId: string, active: boolean) =>
  patch(`${END_POINT.WELFARES}/${welfareId}/memberships/${membershipId}`, { active });

const useSetMemberActive = (welfareId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ membershipId, active }: { membershipId: string; active: boolean }) => setMemberActive(welfareId, membershipId, active),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MEMBERSHIPS, welfareId] });
    },
  });
};

export default useSetMemberActive;
