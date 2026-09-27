import { useQuery } from '@tanstack/react-query';
import type { RoomListResponse } from '@common/shared';
import { END_POINT } from '../../../constant/endpoint';
import { get } from '../../../libs/api';
import { QUERY_KEYS } from '../../../constant/queryKeys';

export const getRooms = (welfareId: string) => get<RoomListResponse>(`${END_POINT.WELFARES}/${welfareId}/rooms`);

const useGetRooms = (welfareId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ROOMS, welfareId],
    queryFn: () => getRooms(welfareId),
  });
};

export default useGetRooms;
