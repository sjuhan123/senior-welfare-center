import { useMutation, useQueryClient } from '@tanstack/react-query';
import { END_POINT } from '../../../constant/endpoint';
import { del } from '../../../libs/api';
import { QUERY_KEYS } from '../../../constant/queryKeys';

export const leaveRoomMember = (welfareId: string, roomId: string, userId: string) =>
  del(`${END_POINT.WELFARES}/${welfareId}/rooms/${roomId}/members/${userId}`);

const useLeaveRoomMember = (welfareId: string, roomId: string | null) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (userId: string) => leaveRoomMember(welfareId, roomId as string, userId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ROOM_MEMBERS, roomId] });
    },
  });
};

export default useLeaveRoomMember;
