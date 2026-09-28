import router from '../router';

export function forceLogout() {
  const redirectTo = window.location.pathname;
  router.navigate(`/login?redirectTo=${encodeURIComponent(redirectTo)}`);
}
