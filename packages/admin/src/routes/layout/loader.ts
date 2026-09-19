import { redirect, type LoaderFunctionArgs } from 'react-router';
import type { UserResponse, MembershipListResponse } from '@common/shared';
import { END_POINT } from '../../constant/endpoint';
import { get } from '../../libs/api';

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    const [user, memberships] = await Promise.all([get<UserResponse>(END_POINT.USER), get<MembershipListResponse>(END_POINT.MEMBERSHIPS_ME)]);

    const membership = memberships.data.find(m => (m.role === 'admin' || m.role === 'super') && m.status === 'approved');

    return { user: user.data, membership };
  } catch {
    const redirectTo = new URL(request.url).pathname;
    return redirect(`/login?redirectTo=${encodeURIComponent(redirectTo)}`);
  }
}
