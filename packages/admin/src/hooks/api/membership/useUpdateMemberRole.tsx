import type { MembershipRole, WelfareMemberListResponse } from '@common/shared';
import { END_POINT } from '../../../constant/endpoint';
import { patch } from '../../../libs/api';
import { QUERY_KEYS } from '../../../constant/queryKeys';
import useOptimisticPatch from '../../useOptimisticPatch';
import type { WelfareMembersParams } from './useGetWelfareMembers';

type UpdateMemberRoleVars = { membershipId: string; role: MembershipRole; updatedAt: string };

export const updateMemberRole = (welfareId: string, vars: UpdateMemberRoleVars) =>
  patch(`${END_POINT.WELFARES}/${welfareId}/memberships/${vars.membershipId}`, { role: vars.role, updatedAt: vars.updatedAt });

const useUpdateMemberRole = (welfareId: string, params: WelfareMembersParams) => {
  return useOptimisticPatch<WelfareMemberListResponse, UpdateMemberRoleVars>({
    queryKey: [QUERY_KEYS.MEMBERSHIPS, welfareId, params],
    patchFn: vars => updateMemberRole(welfareId, vars),
    applyOptimistic: (previous, vars) => ({
      ...previous,
      data: {
        ...previous.data,
        members: previous.data.members.map(member => (member._id === vars.membershipId ? { ...member, role: vars.role } : member)),
      },
    }),
  });
};

export default useUpdateMemberRole;
