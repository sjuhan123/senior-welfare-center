import { useQuery } from '@tanstack/react-query';
import type { CourseListResponse } from '@common/shared';
import { END_POINT } from '../../../constant/endpoint';
import { get } from '../../../libs/api';
import { QUERY_KEYS } from '../../../constant/queryKeys';

export const getCourses = (welfareId: string) => get<CourseListResponse>(`${END_POINT.WELFARES}/${welfareId}/courses`);

const useGetCourses = (welfareId: string | null) => {
  return useQuery({
    queryKey: [QUERY_KEYS.COURSES, welfareId],
    queryFn: () => getCourses(welfareId as string),
    enabled: !!welfareId,
  });
};

export default useGetCourses;
