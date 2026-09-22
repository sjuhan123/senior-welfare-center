import type { MealListResponse } from '@common/shared';
import { END_POINT } from '../../../constant/endpoint';
import { del } from '../../../libs/api';
import { QUERY_KEYS } from '../../../constant/queryKeys';
import useOptimisticPatch from '../../useOptimisticPatch';

type DeleteMealVars = { mealId: string; date: string; updatedAt: string };

export const deleteMeal = (welfareId: string, vars: DeleteMealVars) =>
  del(`${END_POINT.WELFARES}/${welfareId}/meals/${vars.mealId}`, { data: { updatedAt: vars.updatedAt } });

const useDeleteMeal = (welfareId: string, month: string) => {
  return useOptimisticPatch<MealListResponse, DeleteMealVars>({
    queryKey: [QUERY_KEYS.MEALS, welfareId, month],
    patchFn: vars => deleteMeal(welfareId, vars),
    applyOptimistic: (previous, vars) => ({
      ...previous,
      data: previous.data.filter(meal => meal.date !== vars.date),
    }),
  });
};

export default useDeleteMeal;
