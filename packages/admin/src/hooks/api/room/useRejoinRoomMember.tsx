import { useMutation, useQueryClient } from '@tanstack/react-query';
import { END_POINT } from '../../../constant/endpoint';
import { post } from '../../../libs/api';
import { QUERY_KEYS } from '../../../constant/queryKeys';

export const rejoinRoomMember = (welfareId: string, roomId: string, userId: string) =>
  post(`${END_POINT.WELFARES}/${welfareId}/rooms/${roomId}/members/${userId}`);

const useRejoinRoomMember = (welfareId: string, roomId: string | null) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => rejoinRoomMember(welfareId, roomId as string, userId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ROOM_MEMBERS, roomId] });
    },
  });
};

export default useRejoinRoomMember;
