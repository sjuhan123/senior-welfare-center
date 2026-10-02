import type { WelfareData, WelfareDetailResponse } from '@common/shared';
import { END_POINT } from '../../../constant/endpoint';
import { patch } from '../../../libs/api';
import { QUERY_KEYS } from '../../../constant/queryKeys';
import useOptimisticPatch from '../../useOptimisticPatch';

export type WelfareUpdateFields = Pick<WelfareData, 'name' | 'address' | 'phone' | 'homepage' | 'remarks'>;
type WelfareUpdateVars = WelfareUpdateFields & { updatedAt: string };

export const updateWelfare = (welfareId: string, vars: WelfareUpdateVars) => patch<WelfareDetailResponse>(`${END_POINT.WELFARES}/${welfareId}`, vars);

const useUpdateWelfare = (welfareId: string) => {
  return useOptimisticPatch<WelfareDetailResponse, WelfareUpdateVars>({
    queryKey: [QUERY_KEYS.WELFARE, welfareId],
    patchFn: vars => updateWelfare(welfareId, vars),
    applyOptimistic: (previous, vars) => ({ ...previous, data: { ...previous.data, ...vars } }),
    extraInvalidateKeys: [[QUERY_KEYS.MEMBERSHIPS]],
  });
};

export default useUpdateWelfare;
