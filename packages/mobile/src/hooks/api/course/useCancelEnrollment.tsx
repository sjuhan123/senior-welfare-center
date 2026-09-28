import { useMutation, useQueryClient } from '@tanstack/react-query';
import { END_POINT } from '../../../constant/endpoint';
import { del } from '../../../libs/api';
import { QUERY_KEYS } from '../../../constant/queryKeys';

export const cancelEnrollment = (welfareId: string, courseId: string) =>
  del(`${END_POINT.WELFARES}/${welfareId}/courses/${courseId}/enrollments/mine`);

const useCancelEnrollment = (welfareId: string | null) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (courseId: string) => cancelEnrollment(welfareId as string, courseId),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.ENROLLMENTS, 'mine', welfareId] });
    },
  });
};

export default useCancelEnrollment;
