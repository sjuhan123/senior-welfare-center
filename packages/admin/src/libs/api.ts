import axios, { type AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';

import { ApiException } from '../exceptions/apiException';
import { END_POINT } from '../constant/endpoint';
import { forceLogout } from './forceLogout';

type RetryableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

const instance = axios.create({
  baseURL: import.meta.env.VITE_PUBLIC_BASE_URL || '',
  withCredentials: true,
});

/** /auth/admin/refresh 전용 인스턴스. instance와 분리해서 아래 401 인터셉터를 다시 타지 않게 함(무한 루프 방지). */
const refreshClient = axios.create({
  baseURL: import.meta.env.VITE_PUBLIC_BASE_URL || '',
  withCredentials: true,
});

let refreshPromise: Promise<void> | null = null;

async function refreshAccessToken(): Promise<void> {
  // refreshToken은 httpOnly 쿠키라 여기서 직접 다루지 않음. withCredentials로 자동 전송되고,
  // 응답의 Set-Cookie로 access/refresh 쿠키가 자동 갱신됨.
  await refreshClient.post(END_POINT.AUTH_ADMIN_REFRESH);
}

function refreshAccessTokenOnce(): Promise<void> {
  if (!refreshPromise) {
    refreshPromise = refreshAccessToken().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}

/** refresh 자체가 401/403이면 인증 실패로 보고 로그아웃 처리. 네트워크 오류·타임아웃·5xx는 일시적 실패라 로그아웃시키지 않음. */
function isAuthFailure(error: unknown): boolean {
  if (axios.isAxiosError(error)) {
    return error.response?.status === 401 || error.response?.status === 403;
  }
  return false;
}

// Response interceptor
const interceptorResponseFulfilled = (res: AxiosResponse) => {
  if (200 <= res.status && res.status < 300) {
    return res.data;
  }

  return Promise.reject(res.data);
};

// Response interceptor
const interceptorResponseRejected = async (error: AxiosError<{ message?: string }>) => {
  const originalRequest = error.config as RetryableConfig | undefined;
  const status = error.response?.status;
  const message = error.response?.data?.message ?? error.message;

  if (status !== 401 || !originalRequest) {
    return Promise.reject(new ApiException(message, status));
  }

  if (originalRequest._retry) {
    forceLogout();
    return Promise.reject(new ApiException(message, status));
  }
  originalRequest._retry = true;

  try {
    await refreshAccessTokenOnce();
    return instance(originalRequest);
  } catch (refreshError) {
    if (isAuthFailure(refreshError)) {
      forceLogout();
    }
    return Promise.reject(new ApiException(message, status));
  }
};

instance.interceptors.response.use(interceptorResponseFulfilled, interceptorResponseRejected);

export const get = <T>(...args: Parameters<typeof instance.get>) => {
  return instance.get<T, T>(...args);
};

export const post = <T>(...args: Parameters<typeof instance.post>) => {
  return instance.post<T, T>(...args);
};

export const put = <T>(...args: Parameters<typeof instance.put>) => {
  return instance.put<T, T>(...args);
};

export const patch = <T>(...args: Parameters<typeof instance.patch>) => {
  return instance.patch<T, T>(...args);
};

export const del = <T>(...args: Parameters<typeof instance.delete>) => {
  return instance.delete<T, T>(...args);
};
