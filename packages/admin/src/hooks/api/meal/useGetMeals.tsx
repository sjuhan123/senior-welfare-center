import { useQuery } from '@tanstack/react-query';
import type { MealListResponse } from '@common/shared';
import { END_POINT } from '../../../constant/endpoint';
import { get } from '../../../libs/api';
import { QUERY_KEYS } from '../../../constant/queryKeys';

export const getMeals = (welfareId: string, month: string) =>
  get<MealListResponse>(`${END_POINT.WELFARES}/${welfareId}/meals`, { params: { month } });

const useGetMeals = (welfareId: string, month: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.MEALS, welfareId, month],
    queryFn: () => getMeals(welfareId, month),
  });
};

export default useGetMeals;
