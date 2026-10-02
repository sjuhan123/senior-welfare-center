import { useQuery } from '@tanstack/react-query';
import type { MyEnrollmentsResponse } from '@common/shared';
import { END_POINT } from '../../../constant/endpoint';
import { get } from '../../../libs/api';
import { QUERY_KEYS } from '../../../constant/queryKeys';

export const getMyEnrollments = (welfareId: string) => get<MyEnrollmentsResponse>(`${END_POINT.WELFARES}/${welfareId}/enrollments/mine`);

const useGetMyEnrollments = (welfareId: string | null) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ENROLLMENTS, 'mine', welfareId],
    queryFn: () => getMyEnrollments(welfareId as string),
    enabled: !!welfareId,
  });
};

export default useGetMyEnrollments;
