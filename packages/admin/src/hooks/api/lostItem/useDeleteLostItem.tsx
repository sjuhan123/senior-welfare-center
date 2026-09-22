import type { LostItemListResponse } from '@common/shared';
import { END_POINT } from '../../../constant/endpoint';
import { del } from '../../../libs/api';
import { QUERY_KEYS } from '../../../constant/queryKeys';
import useOptimisticPatch from '../../useOptimisticPatch';

type DeleteLostItemVars = { lostItemId: string; updatedAt: string };

export const deleteLostItem = (welfareId: string, vars: DeleteLostItemVars) =>
  del(`${END_POINT.WELFARES}/${welfareId}/lost-items/${vars.lostItemId}`, { data: { updatedAt: vars.updatedAt } });

const useDeleteLostItem = (welfareId: string) => {
  return useOptimisticPatch<LostItemListResponse, DeleteLostItemVars>({
    queryKey: [QUERY_KEYS.LOST_ITEMS, welfareId],
    patchFn: vars => deleteLostItem(welfareId, vars),
    applyOptimistic: (previous, vars) => ({
      ...previous,
      data: previous.data.filter(lostItem => lostItem._id !== vars.lostItemId),
    }),
  });
};

export default useDeleteLostItem;
