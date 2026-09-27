import { useMutation, useQueryClient } from '@tanstack/react-query';
import type { CourseDetailResponse, ScheduleItem } from '@common/shared';
import { END_POINT } from '../../../constant/endpoint';
import { post } from '../../../libs/api';
import { QUERY_KEYS } from '../../../constant/queryKeys';

export type CreateCourseFields = {
  name: string;
  schedule: ScheduleItem[];
  place: string;
  teacher: string;
  cap: string;
  from: string;
  to: string;
  rooms: ('chat' | 'feed')[];
  availableFrom: string;
  availableTo: string;
};

export const createCourse = (welfareId: string, fields: CreateCourseFields) =>
  post<CourseDetailResponse>(`${END_POINT.WELFARES}/${welfareId}/courses`, fields);

const useCreateCourse = (welfareId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (fields: CreateCourseFields) => createCourse(welfareId, fields),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COURSES, welfareId] });
    },
  });
};

export default useCreateCourse;
