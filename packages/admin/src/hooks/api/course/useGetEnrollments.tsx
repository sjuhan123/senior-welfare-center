import { useQuery } from '@tanstack/react-query';
import type { EnrollmentListResponse } from '@common/shared';
import { END_POINT } from '../../../constant/endpoint';
import { get } from '../../../libs/api';
import { QUERY_KEYS } from '../../../constant/queryKeys';

export const getEnrollments = (welfareId: string, courseId: string) =>
  get<EnrollmentListResponse>(`${END_POINT.WELFARES}/${welfareId}/courses/${courseId}/enrollments`);

const useGetEnrollments = (welfareId: string, courseId: string | null) => {
  return useQuery({
    queryKey: [QUERY_KEYS.ENROLLMENTS, courseId],
    queryFn: () => getEnrollments(welfareId, courseId as string),
    enabled: !!courseId,
  });
};

export default useGetEnrollments;
