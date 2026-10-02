import { useMutation, useQueryClient } from '@tanstack/react-query';
import { END_POINT } from '../../../constant/endpoint';
import { del } from '../../../libs/api';
import { QUERY_KEYS } from '../../../constant/queryKeys';

export const deleteCourse = (welfareId: string, courseId: string) => del(`${END_POINT.WELFARES}/${welfareId}/courses/${courseId}`);

const useDeleteCourse = (welfareId: string) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseId: string) => deleteCourse(welfareId, courseId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.COURSES, welfareId] });
    },
  });
};

export default useDeleteCourse;
