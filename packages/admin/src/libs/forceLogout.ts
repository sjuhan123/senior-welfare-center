import router from '../router';

export function forceLogout() {
  /* 라우트 loader 실행 중(네비게이션 진행 중)에 호출되면 loader 자신의 redirect와
   * 겹쳐서 라우터가 멈춘다. loader 바깥(화면이 이미 떠 있는 상태)에서 401을 받은
   * 경우에만 수동으로 개입한다. */
  if (router.state.navigation.state !== 'idle') return;

  const redirectTo = window.location.pathname;
  router.navigate(`/login?redirectTo=${encodeURIComponent(redirectTo)}`);
}
