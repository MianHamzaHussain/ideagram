import axios, { AxiosError, type InternalAxiosRequestConfig } from 'axios';
import { useAuthStore } from '../store/useAuthStore';

export const BASE_URL = '/api/v1/';

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
});


axiosInstance.interceptors.request.use(
  (config) => {
    const isFormData = config.data instanceof FormData ||
      (config.data && typeof config.data.append === 'function');

    if (isFormData) {
      // Rigorously remove Content-Type to let the browser handle the boundary
      delete config.headers['Content-Type'];
      if (config.headers.delete) {
        config.headers.delete('Content-Type');
        config.headers.delete('content-type');
      }
    } else if (config.data && !config.headers['Content-Type'] && !config.headers['content-type']) {
      // Default to JSON for standard objects if not already set
      config.headers['Content-Type'] = 'application/json';
    }
    return config;
  },
  (error) => Promise.reject(error)
);


// Flag to prevent multiple refresh calls
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (err: any) => void;
}> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

// Request Interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const { accessToken } = useAuthStore.getState();
    if (accessToken && config.headers) {
      config.headers.Authorization = `JWT ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // If 401 error and not a retry yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `JWT ${token}`;
            }
            return axiosInstance(originalRequest);
          })
          .catch((err) => Promise.reject(err));
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const { refreshToken, setTokens, logout } = useAuthStore.getState();

      if (!refreshToken) {
        logout();
        return Promise.reject(error);
      }

      try {
        const response = await axios.post(`${BASE_URL}auth/token/refresh/`, {
          refresh: refreshToken,
        });

        const { access: newAccessToken, refresh: newRefreshToken } = response.data;

        setTokens(newAccessToken, newRefreshToken);
        processQueue(null, newAccessToken);

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `JWT ${newAccessToken}`;
        }
        return axiosInstance(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        logout();
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export const apiClient = {
  get: <T>(url: string) => axiosInstance.get<T>(url).then((res) => res.data),
  post: <T>(url: string, body: any, config?: any) => axiosInstance.post<T>(url, body, config).then((res) => res.data),
  put: <T>(url: string, body: any, config?: any) => axiosInstance.put<T>(url, body, config).then((res) => res.data),
  patch: <T>(url: string, body: any, config?: any) => axiosInstance.patch<T>(url, body, config).then((res) => res.data),
  delete: <T>(url: string) => axiosInstance.delete<T>(url).then((res) => res.data),
};
