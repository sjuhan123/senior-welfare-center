import axios, { type AxiosError, type AxiosResponse } from 'axios';

import { ApiException } from '../exceptions/apiException';

const instance = axios.create({
  baseURL: import.meta.env.VITE_PUBLIC_BASE_URL || '',
  withCredentials: true,
});

// Response interceptor
const interceptorResponseFulfilled = (res: AxiosResponse) => {
  if (200 <= res.status && res.status < 300) {
    return res.data;
  }

  return Promise.reject(res.data);
};

// Response interceptor
const interceptorResponseRejected = (error: AxiosError<{ message?: string }>) => {
  const status = error.response?.status;
  const message = error.response?.data?.message ?? error.message;

  return Promise.reject(new ApiException(message, status));
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
