import { useQuery } from '@tanstack/react-query';
import type { CourseRoomsResponse } from '@common/shared';
import { END_POINT } from '../../../constant/endpoint';
import { get } from '../../../libs/api';
import { QUERY_KEYS } from '../../../constant/queryKeys';

export const getCourseRooms = (welfareId: string, courseId: string) =>
  get<CourseRoomsResponse>(`${END_POINT.WELFARES}/${welfareId}/courses/${courseId}/rooms`);

const useGetCourseRooms = (welfareId: string, courseId: string | null) => {
  return useQuery({
    queryKey: [QUERY_KEYS.COURSE_ROOMS, courseId],
    queryFn: () => getCourseRooms(welfareId, courseId as string),
    enabled: !!courseId,
  });
};

export default useGetCourseRooms;
