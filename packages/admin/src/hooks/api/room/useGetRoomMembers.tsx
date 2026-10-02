import { useQuery } from '@tanstack/react-query';
import type { RoomMembersResponse } from '@common/shared';
import { END_POINT } from '../../../constant/endpoint';
import { get } from '../../../libs/api';
import { QUERY_KEYS } from '../../../constant/queryKeys';

export const getRoomMembers = (welfareId: string, roomId: string) =>
  get<RoomMembersResponse>(`${END_POINT.WELFARES}/${welfareId}/rooms/${roomId}/members`);

const useGetRoomMembers = (welfareId: string, roomId: string | null) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ROOM_MEMBERS, roomId],
    queryFn: () => getRoomMembers(welfareId, roomId as string),
    enabled: !!roomId,
  });
};

export default useGetRoomMembers;
