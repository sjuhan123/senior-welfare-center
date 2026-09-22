import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { LostItemDetailResponse } from '@common/shared';
import { END_POINT } from '../../../constant/endpoint';
import { post } from '../../../libs/api';
import { QUERY_KEYS } from '../../../constant/queryKeys';

export type LostItemFields = { item: string; where: string; when: string; keep: string; notifyNotice: boolean };

export const createLostItem = (welfareId: string, fields: LostItemFields) =>
  post<LostItemDetailResponse>(`${END_POINT.WELFARES}/${welfareId}/lost-items`, fields);

const useCreateLostItem = (welfareId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (fields: LostItemFields) => createLostItem(welfareId, fields),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.LOST_ITEMS, welfareId] });
    },
  });
};

export default useCreateLostItem;
