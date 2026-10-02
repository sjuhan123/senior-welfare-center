import { redirect, type LoaderFunctionArgs } from 'react-router';
import { END_POINT } from '../../constant/endpoint';
import { get } from '../../libs/api';

export async function loader({ request }: LoaderFunctionArgs) {
  try {
    await get(END_POINT.USER);
  } catch {
    const redirectTo = new URL(request.url).pathname;
    return redirect(`/login?redirectTo=${encodeURIComponent(redirectTo)}`);
  }

  return null;
}
