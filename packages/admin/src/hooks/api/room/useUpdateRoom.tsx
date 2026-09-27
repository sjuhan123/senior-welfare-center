import { useMutation, useQueryClient } from '@tanstack/react-query';
import { END_POINT } from '../../../constant/endpoint';
import { patch } from '../../../libs/api';
import { QUERY_KEYS } from '../../../constant/queryKeys';

export type UpdateRoomVars = { roomId: string; availableFrom: string; availableTo: string };

export const updateRoom = (welfareId: string, vars: UpdateRoomVars) =>
  patch(`${END_POINT.WELFARES}/${welfareId}/rooms/${vars.roomId}`, { availableFrom: vars.availableFrom, availableTo: vars.availableTo });

const useUpdateRoom = (welfareId: string, courseId: string | null) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (vars: UpdateRoomVars) => updateRoom(welfareId, vars),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COURSE_ROOMS, courseId] });
    },
  });
};

export default useUpdateRoom;
