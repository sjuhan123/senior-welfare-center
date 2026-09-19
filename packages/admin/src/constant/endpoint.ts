const BASE_URL = import.meta.env.VITE_PUBLIC_BASE_URL || '';

export const END_POINT = Object.freeze({
  USER: `${BASE_URL}api/user`,
  KAKAO_LOGIN: `${BASE_URL}api/auth/kakao`,
  KAKAO_LOGIN_ADMIN: `${BASE_URL}api/auth/kakao/admin`,
  KAKAO_LOGOUT: `${BASE_URL}api/user/logout`,
  MEMBERSHIPS_ME: `${BASE_URL}api/memberships/me`,
  MEMBERSHIPS: `${BASE_URL}api/memberships`,
});
