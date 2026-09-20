import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { WelfareData, WelfareDetailResponse } from '@common/shared';
import { END_POINT } from '../../../constant/endpoint';
import { patch } from '../../../libs/api';
import { QUERY_KEYS } from '../../../constant/queryKeys';

export type WelfareUpdateFields = Pick<WelfareData, 'name' | 'address' | 'phone' | 'homepage' | 'remarks'>;

export const updateWelfare = (welfareId: string, fields: WelfareUpdateFields) =>
  patch<WelfareDetailResponse>(`${END_POINT.WELFARES}/${welfareId}`, fields);

const useUpdateWelfare = (welfareId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (fields: WelfareUpdateFields) => updateWelfare(welfareId, fields),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.WELFARE, welfareId] });
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.MEMBERSHIPS] });
    },
  });
};

export default useUpdateWelfare;
