import { useMutation, useQueryClient } from '@tanstack/react-query';
import { END_POINT } from '../../../constant/endpoint';
import { del } from '../../../libs/api';
import { QUERY_KEYS } from '../../../constant/queryKeys';

export const hideMessage = (welfareId: string, roomId: string, messageId: string) =>
  del(`${END_POINT.WELFARES}/${welfareId}/rooms/${roomId}/messages/${messageId}`);

const useHideMessage = (welfareId: string | null, roomId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (messageId: string) => hideMessage(welfareId as string, roomId, messageId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MESSAGES, welfareId, roomId] });
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ROOMS, welfareId] });
    },
  });
};

export default useHideMessage;
