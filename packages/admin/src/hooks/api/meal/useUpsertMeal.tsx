import type { MealDetailResponse, MealListResponse } from '@common/shared';
import { END_POINT } from '../../../constant/endpoint';
import { put } from '../../../libs/api';
import { QUERY_KEYS } from '../../../constant/queryKeys';
import useOptimisticPatch from '../../useOptimisticPatch';

type UpsertMealVars = { date: string; items: string[]; updatedAt?: string };

export const upsertMeal = (welfareId: string, vars: UpsertMealVars) =>
  put<MealDetailResponse>(`${END_POINT.WELFARES}/${welfareId}/meals/${vars.date}`, { items: vars.items, updatedAt: vars.updatedAt });

const useUpsertMeal = (welfareId: string, month: string) => {
  return useOptimisticPatch<MealListResponse, UpsertMealVars>({
    queryKey: [QUERY_KEYS.MEALS, welfareId, month],
    patchFn: vars => upsertMeal(welfareId, vars),
    applyOptimistic: (previous, vars) => ({
      ...previous,
      data: previous.data.map(meal => (meal.date === vars.date ? { ...meal, items: vars.items } : meal)),
    }),
  });
};

export default useUpsertMeal;
