import axios, { type AxiosError, type AxiosResponse, type InternalAxiosRequestConfig } from 'axios';

import { getUserToken, getRefreshToken, setUserToken, setRefreshToken } from '../utills/persistentStorage';
import { ApiException } from '../exceptions/ApiException';
import { END_POINT } from '../constant/endpoint';
import { forceLogout } from './forceLogout';

type RetryableConfig = InternalAxiosRequestConfig & { _retry?: boolean };

type RefreshResponse = {
  statusCode: number;
  message: string;
  data: { accessToken: string; refreshToken: string };
};

class NoRefreshTokenError extends Error {}

const instance = axios.create({
  baseURL: process.env.EXPO_PUBLIC_BASE_URL || '',
});

/** /auth/mobile/refresh 전용 인스턴스. instance와 분리해서 아래 401 인터셉터를 다시 타지 않게 함(무한 루프 방지). */
const refreshClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_BASE_URL || '',
});

let refreshPromise: Promise<string> | null = null;

async function refreshAccessToken(): Promise<string> {
  const refreshToken = await getRefreshToken();
  if (!refreshToken) {
    throw new NoRefreshTokenError('저장된 refresh token이 없습니다');
  }

  const res = await refreshClient.post<RefreshResponse>(END_POINT.AUTH_MOBILE_REFRESH, { refreshToken });
  const { accessToken, refreshToken: newRefreshToken } = res.data.data;

  // 회전 방식이라 refreshToken도 같이 갱신해야 다음 리프레시가 성공함
  await setUserToken(accessToken);
  await setRefreshToken(newRefreshToken);

  return accessToken;
}

function getAccessTokenAfterRefresh(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = refreshAccessToken().finally(() => {
      refreshPromise = null;
    });
  }

  return refreshPromise;
}

/** refreshToken 자체가 없거나(401/403) 무효인 경우만 인증 실패. 네트워크 오류·타임아웃·5xx는 일시적 실패라 로그아웃시키지 않음. */
function isAuthFailure(error: unknown): boolean {
  if (error instanceof NoRefreshTokenError) return true;
  if (axios.isAxiosError(error)) {
    return error.response?.status === 401 || error.response?.status === 403;
  }
  return false;
}

const interceptorRequestFulfilled = async (config: InternalAxiosRequestConfig) => {
  const accessToken = await getUserToken();
  if (!config.headers) return config;
  if (!accessToken) return config;

  config.headers.Authorization = `Bearer ${accessToken}`;

  return config;
};

instance.interceptors.request.use(interceptorRequestFulfilled);

// Response interceptor
const interceptorResponseFulfilled = (res: AxiosResponse) => {
  if (200 <= res.status && res.status < 300) {
    return res.data;
  }

  return Promise.reject(res.data);
};

// Response interceptor
const interceptorResponseRejected = async (error: AxiosError) => {
  const originalRequest = error.config as RetryableConfig | undefined;
  const status = error.response?.status;

  if (status !== 401 || !originalRequest) {
    return Promise.reject(new ApiException(error.message, error.code));
  }

  if (originalRequest._retry) {
    await forceLogout();
    return Promise.reject(new ApiException(error.message, error.code));
  }
  originalRequest._retry = true;

  try {
    const accessToken = await getAccessTokenAfterRefresh();
    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
    return instance(originalRequest);
  } catch (refreshError) {
    if (isAuthFailure(refreshError)) {
      await forceLogout();
    }
    return Promise.reject(new ApiException(error.message, error.code));
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
