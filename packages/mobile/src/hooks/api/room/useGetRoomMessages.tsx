import { useQuery } from '@tanstack/react-query';
import type { MessageListResponse } from '@common/shared';
import { END_POINT } from '../../../constant/endpoint';
import { get } from '../../../libs/api';
import { QUERY_KEYS } from '../../../constant/queryKeys';

export const getRoomMessages = (welfareId: string, roomId: string) =>
  get<MessageListResponse>(`${END_POINT.WELFARES}/${welfareId}/rooms/${roomId}/messages`);

const useGetRoomMessages = (welfareId: string | null, roomId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.MESSAGES, welfareId, roomId],
    queryFn: () => getRoomMessages(welfareId as string, roomId),
    enabled: !!welfareId,
  });
};

export default useGetRoomMessages;
