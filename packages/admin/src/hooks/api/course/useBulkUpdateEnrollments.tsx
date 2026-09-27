import type { EnrollmentListResponse, EnrollmentState } from '@common/shared';
import { END_POINT } from '../../../constant/endpoint';
import { patch } from '../../../libs/api';
import { QUERY_KEYS } from '../../../constant/queryKeys';
import useOptimisticPatch from '../../useOptimisticPatch';

export type BulkUpdateEnrollmentsVars = { courseId: string; enrollmentIds: string[]; state: EnrollmentState };

export const bulkUpdateEnrollments = (welfareId: string, vars: BulkUpdateEnrollmentsVars) =>
  patch(`${END_POINT.WELFARES}/${welfareId}/courses/${vars.courseId}/enrollments`, {
    enrollmentIds: vars.enrollmentIds,
    state: vars.state,
  });

const useBulkUpdateEnrollments = (welfareId: string) => {
  return useOptimisticPatch<EnrollmentListResponse, BulkUpdateEnrollmentsVars>({
    queryKey: [QUERY_KEYS.ENROLLMENTS],
    patchFn: vars => bulkUpdateEnrollments(welfareId, vars),
    applyOptimistic: (previous, vars) => ({
      ...previous,
      data: previous.data.map(enrollment => (vars.enrollmentIds.includes(enrollment._id) ? { ...enrollment, state: vars.state } : enrollment)),
    }),
  });
};

export default useBulkUpdateEnrollments;
