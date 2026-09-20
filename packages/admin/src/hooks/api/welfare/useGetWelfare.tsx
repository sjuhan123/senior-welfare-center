import { type UseQueryOptions, useQuery } from '@tanstack/react-query';
import type { WelfareDetailResponse } from '@common/shared';
import { END_POINT } from '../../../constant/endpoint';
import { get } from '../../../libs/api';
import { QUERY_KEYS } from '../../../constant/queryKeys';

export const getWelfare = (welfareId: string) => get<WelfareDetailResponse>(`${END_POINT.WELFARES}/${welfareId}`);

const useGetWelfare = (welfareId: string, options?: UseQueryOptions<WelfareDetailResponse>) => {
  return useQuery<WelfareDetailResponse>({
    queryKey: [QUERY_KEYS.WELFARE, welfareId],
    queryFn: () => getWelfare(welfareId),
    ...options,
  });
};

export default useGetWelfare;
