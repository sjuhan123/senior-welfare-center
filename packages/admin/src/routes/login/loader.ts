import { redirect, type LoaderFunctionArgs } from 'react-router';

import { get, post } from '../../libs/api';
import { ApiException } from '../../exceptions/apiException';
import { END_POINT } from '../../constant/endpoint';

function resolveRedirectTo(request: Request) {
  const redirectTo = new URL(request.url).searchParams.get('redirectTo');
  if (!redirectTo) return '/';

  const isSafeRedirect = new URL(redirectTo, window.location.origin).origin === window.location.origin;
  return isSafeRedirect ? redirectTo : '/';
}

export async function loader({ request }: LoaderFunctionArgs) {
  /*
   * 로그인 로더 플로우
   *
   * 1. code param이 존재하는 경우
   *  -> POST /api/auth/kakao/admin
   *  -> 200: throw redirect('/')
   *
   * 2. code param이 존재하지 않는 경우
   *  -> GET /api/user
   *  -> 200 throw redirect('/')
   *  -> 403 return null
   *
   **/

  const code = new URL(request.url).searchParams.get('code');

  if (code) {
    try {
      await post(END_POINT.KAKAO_LOGIN_ADMIN, { code });
    } catch (error) {
      if (error instanceof ApiException && error.status === 403) {
        return { error: error.message };
      }
      throw error;
    }

    return redirect(resolveRedirectTo(request));
  }

  try {
    await get(END_POINT.USER);
  } catch {
    return null;
  }

  return redirect('/');
}
