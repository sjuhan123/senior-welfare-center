import type { CourseListResponse, ScheduleItem } from '@common/shared';
import { END_POINT } from '../../../constant/endpoint';
import { patch } from '../../../libs/api';
import { QUERY_KEYS } from '../../../constant/queryKeys';
import useOptimisticPatch from '../../useOptimisticPatch';

export type UpdateCourseVars = {
  courseId: string;
  updatedAt: string;
  name?: string;
  schedule?: ScheduleItem[];
  place?: string;
  teacher?: string | null;
  cap?: number;
  from?: string;
  to?: string;
};

export const updateCourse = (welfareId: string, vars: UpdateCourseVars) => patch(`${END_POINT.WELFARES}/${welfareId}/courses/${vars.courseId}`, vars);

const useUpdateCourse = (welfareId: string) => {
  return useOptimisticPatch<CourseListResponse, UpdateCourseVars>({
    queryKey: [QUERY_KEYS.COURSES, welfareId],
    patchFn: vars => updateCourse(welfareId, vars),
    applyOptimistic: (previous, vars) => ({
      ...previous,
      data: previous.data.map(course => (course._id === vars.courseId ? { ...course, ...vars } : course)),
    }),
  });
};

export default useUpdateCourse;
