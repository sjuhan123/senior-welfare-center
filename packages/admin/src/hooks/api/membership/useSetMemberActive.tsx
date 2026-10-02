import type { WelfareMemberListResponse } from '@common/shared';
import { END_POINT } from '../../../constant/endpoint';
import { patch } from '../../../libs/api';
import { QUERY_KEYS } from '../../../constant/queryKeys';
import useOptimisticPatch from '../../useOptimisticPatch';
import type { WelfareMembersParams } from './useGetWelfareMembers';

type SetMemberActiveVars = { membershipId: string; active: boolean; updatedAt: string };

export const setMemberActive = (welfareId: string, vars: SetMemberActiveVars) =>
  patch(`${END_POINT.WELFARES}/${welfareId}/memberships/${vars.membershipId}`, { active: vars.active, updatedAt: vars.updatedAt });

const useSetMemberActive = (welfareId: string, params: WelfareMembersParams) => {
  return useOptimisticPatch<WelfareMemberListResponse, SetMemberActiveVars>({
    queryKey: [QUERY_KEYS.MEMBERSHIPS, welfareId, params],
    patchFn: vars => setMemberActive(welfareId, vars),
    applyOptimistic: (previous, vars) => ({
      ...previous,
      data: {
        ...previous.data,
        members: previous.data.members.map(member => (member._id === vars.membershipId ? { ...member, active: vars.active } : member)),
      },
    }),
  });
};

export default useSetMemberActive;
