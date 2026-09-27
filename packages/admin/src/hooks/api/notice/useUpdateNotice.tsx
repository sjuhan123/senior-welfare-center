import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { MessageResponse } from '@common/shared';
import { END_POINT } from '../../../constant/endpoint';
import { patch } from '../../../libs/api';
import { QUERY_KEYS } from '../../../constant/queryKeys';

export type UpdateNoticeVars = { roomId: string; messageId: string; text: string; updatedAt: string };

export const updateNotice = (welfareId: string, vars: UpdateNoticeVars) =>
  patch<MessageResponse>(`${END_POINT.WELFARES}/${welfareId}/rooms/${vars.roomId}/messages/${vars.messageId}`, {
    text: vars.text,
    updatedAt: vars.updatedAt,
  });

const useUpdateNotice = (welfareId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vars: UpdateNoticeVars) => updateNotice(welfareId, vars),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOTICES, welfareId] });
    },
  });
};

export default useUpdateNotice;
