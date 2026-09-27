import type { EnrollmentListResponse, EnrollmentState } from '@common/shared';
import { END_POINT } from '../../../constant/endpoint';
import { patch } from '../../../libs/api';
import { QUERY_KEYS } from '../../../constant/queryKeys';
import useOptimisticPatch from '../../useOptimisticPatch';

export type UpdateEnrollmentVars = { courseId: string; enrollmentId: string; state: EnrollmentState };

export const updateEnrollment = (welfareId: string, vars: UpdateEnrollmentVars) =>
  patch(`${END_POINT.WELFARES}/${welfareId}/courses/${vars.courseId}/enrollments/${vars.enrollmentId}`, { state: vars.state });

const useUpdateEnrollment = (welfareId: string) => {
  return useOptimisticPatch<EnrollmentListResponse, UpdateEnrollmentVars>({
    queryKey: [QUERY_KEYS.ENROLLMENTS],
    patchFn: vars => updateEnrollment(welfareId, vars),
    applyOptimistic: (previous, vars) => ({
      ...previous,
      data: previous.data.map(enrollment => (enrollment._id === vars.enrollmentId ? { ...enrollment, state: vars.state } : enrollment)),
    }),
  });
};

export default useUpdateEnrollment;
