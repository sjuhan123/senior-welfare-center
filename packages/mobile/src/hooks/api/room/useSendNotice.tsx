import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { MessageResponse } from '@common/shared';
import { END_POINT } from '../../../constant/endpoint';
import { post } from '../../../libs/api';
import { QUERY_KEYS } from '../../../constant/queryKeys';

export const sendNotice = (welfareId: string, roomId: string, text: string, photos: string[]) =>
  post<MessageResponse>(`${END_POINT.WELFARES}/${welfareId}/rooms/${roomId}/messages`, { text, photos });

const useSendNotice = (welfareId: string | null, roomId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ text, photos }: { text: string; photos: string[] }) => sendNotice(welfareId as string, roomId, text, photos),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MESSAGES, welfareId, roomId] });
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ROOMS, welfareId] });
    },
  });
};

export default useSendNotice;
