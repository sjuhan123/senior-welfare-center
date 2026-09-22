import type { LostItemListResponse } from '@common/shared';
import { END_POINT } from '../../../constant/endpoint';
import { patch } from '../../../libs/api';
import { QUERY_KEYS } from '../../../constant/queryKeys';
import useOptimisticPatch from '../../useOptimisticPatch';

export type UpdateLostItemVars = {
  lostItemId: string;
  updatedAt: string;
  item?: string;
  where?: string;
  when?: string;
  keep?: string;
  notifyNotice?: boolean;
  claimed?: boolean;
};

export const updateLostItem = (welfareId: string, vars: UpdateLostItemVars) =>
  patch(`${END_POINT.WELFARES}/${welfareId}/lost-items/${vars.lostItemId}`, vars);

const useUpdateLostItem = (welfareId: string) => {
  return useOptimisticPatch<LostItemListResponse, UpdateLostItemVars>({
    queryKey: [QUERY_KEYS.LOST_ITEMS, welfareId],
    patchFn: vars => updateLostItem(welfareId, vars),
    applyOptimistic: (previous, vars) => ({
      ...previous,
      data: previous.data.map(lostItem => (lostItem._id === vars.lostItemId ? { ...lostItem, ...vars } : lostItem)),
    }),
  });
};

export default useUpdateLostItem;
