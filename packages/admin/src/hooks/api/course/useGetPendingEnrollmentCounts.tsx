import { useQuery } from '@tanstack/react-query';
import type { PendingEnrollmentCountsResponse } from '@common/shared';
import { END_POINT } from '../../../constant/endpoint';
import { get } from '../../../libs/api';
import { QUERY_KEYS } from '../../../constant/queryKeys';

export const getPendingEnrollmentCounts = (welfareId: string) =>
  get<PendingEnrollmentCountsResponse>(`${END_POINT.WELFARES}/${welfareId}/enrollments/pending-count`);

const useGetPendingEnrollmentCounts = (welfareId: string) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ENROLLMENTS, 'pending-count', welfareId],
    queryFn: () => getPendingEnrollmentCounts(welfareId),
  });
};

export default useGetPendingEnrollmentCounts;
