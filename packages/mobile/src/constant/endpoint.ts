const BASE_URL = import.meta.env.VITE_BASE_URL || '';

export const END_POINT = Object.freeze({
  CLOSEST_WELFARES: `${BASE_URL}api/welfares/closest`,
  DISTRICTS: `${BASE_URL}api/districts`,
  USER: `${BASE_URL}api/user`,
  KAKAO_LOGIN: `${BASE_URL}api/auth/kakao`,
  KAKAO_LOGOUT: `${BASE_URL}api/user/logout`,
  USER_WELFARE_BOOKMARK: `${BASE_URL}api/user/welfare`,
  WELFARES: `${BASE_URL}api/welfares`,
});
