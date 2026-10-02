import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { MessageResponse } from '@common/shared';
import { END_POINT } from '../../../constant/endpoint';
import { post } from '../../../libs/api';
import { QUERY_KEYS } from '../../../constant/queryKeys';

export type CreateNoticeVars = { roomId: string; text: string };

export const createNotice = (welfareId: string, vars: CreateNoticeVars) =>
  post<MessageResponse>(`${END_POINT.WELFARES}/${welfareId}/rooms/${vars.roomId}/messages`, { text: vars.text });

const useCreateNotice = (welfareId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vars: CreateNoticeVars) => createNotice(welfareId, vars),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.NOTICES, welfareId] });
    },
  });
};

export default useCreateNotice;
