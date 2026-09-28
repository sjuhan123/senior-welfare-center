import { useMutation, useQueryClient } from '@tanstack/react-query';
import { END_POINT } from '../../../constant/endpoint';
import { post } from '../../../libs/api';
import { QUERY_KEYS } from '../../../constant/queryKeys';

export const applyEnrollment = (welfareId: string, courseId: string) => post(`${END_POINT.WELFARES}/${welfareId}/courses/${courseId}/enrollments`);

const useApplyEnrollment = (welfareId: string | null) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseId: string) => applyEnrollment(welfareId as string, courseId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ENROLLMENTS, 'mine', welfareId] });
    },
  });
};

export default useApplyEnrollment;
