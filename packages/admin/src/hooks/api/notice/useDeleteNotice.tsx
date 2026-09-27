import { useMutation, useQueryClient } from '@tanstack/react-query';
import { END_POINT } from '../../../constant/endpoint';
import { del } from '../../../libs/api';
import { QUERY_KEYS } from '../../../constant/queryKeys';

export type DeleteNoticeVars = { roomId: string; messageId: string };

export const deleteNotice = (welfareId: string, vars: DeleteNoticeVars) =>
  del(`${END_POINT.WELFARES}/${welfareId}/rooms/${vars.roomId}/messages/${vars.messageId}`);

const useDeleteNotice = (welfareId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vars: DeleteNoticeVars) => deleteNotice(welfareId, vars),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOTICES, welfareId] });
    },
  });
};

export default useDeleteNotice;
