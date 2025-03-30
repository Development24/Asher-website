import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, InternalAxiosRequestConfig } from 'axios';
import { userStore } from '@/store/userStore';
import { refreshToken } from '@/services/auth/auth';
import { redirect } from 'next/navigation';
import { toast } from 'sonner';

const BASE_API_URL = process.env.NEXT_PUBLIC_BASE_API_URL;

interface ApiResponse<T = any> {
  data: T;
  status: number;
  message: string;
}

interface ApiError {
  status: number;
  message: string;
}

type ContentType = 'application/json' | 'multipart/form-data';

let failedRequestQueue: Array<{ resolve: (value: AxiosRequestConfig | Promise<AxiosRequestConfig> | any) => void; reject: (error: AxiosError) => void }> = [];

let isRefreshing = false;

const processQueue = (error: AxiosError | null, token: string | null = null) => {
  failedRequestQueue.forEach(request => {
    if (error) {
      request.reject(error)
    } else {
      request.resolve(token as string)
    }
  })
  failedRequestQueue = []
}

const createAxiosInstance = (contentType: ContentType) => {
  const instance = axios.create({
    baseURL: BASE_API_URL,
    headers: {
      'Content-Type': contentType,
    },
  });

  instance.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      const accessToken = localStorage.getItem('access_token');
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
      return config;
    },
    (error: AxiosError) => {
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error: AxiosError<ApiError>) => {
      return handleApiError(error, instance);
    }
  );

  return instance;
};


async function handleApiError(error: AxiosError<ApiError>, instance: AxiosInstance) {
  const clearUser = userStore.getState().clearUser;
  if (error.response) {
    const { status, data } = error.response;
    const message = data?.message || 'An error occurred';
    const originalRequest: any = error.config;


    switch (status) {
      case 400:
        console.error('Bad Request: Please check your input.');
        break;
      case 401:
        if (!originalRequest._retry) {
          if (isRefreshing) {
            return new Promise((resolve, reject) => {
              failedRequestQueue.push({ resolve, reject })
            }).then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`
              return instance(originalRequest)
            }).catch((err: AxiosError) => {
              return Promise.reject(err)
            })
          }
          originalRequest._retry = true
          isRefreshing = true
          try {
            const storeRefreshToken = localStorage.getItem('refresh_token') as string
            if (!refreshToken) throw new Error('No refresh token found')
            const { accessToken: newAccessToken, refreshToken: newRefreshToken } = await refreshToken(storeRefreshToken)
            console.log(newAccessToken, newRefreshToken)
            if (!newAccessToken || !newRefreshToken) {
              throw new Error('Missing accessToken or refreshToken in the response');
            }

            localStorage.setItem('access_token', newAccessToken);
            localStorage.setItem('refresh_token', newRefreshToken);
            instance.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;

            processQueue(null, newAccessToken)
            return instance(originalRequest)

          } catch (refreshError) {
            console.log(refreshError)
            processQueue(refreshError as AxiosError, null)
            userStore.getState().clearUser()

            toast.error('Your session has expired. Please log in again.')
            localStorage.setItem('redirect_url', window.location.pathname);
            redirect('/login')
            return Promise.reject(refreshError)
          } finally {
            isRefreshing = false
          }
        }
        console.error('Unauthorized: Please log in again.');
        localStorage.setItem('redirect_url', window.location.pathname);
        clearUser();
        break;
      case 403:
        console.error('Forbidden: You do not have access to this resource.');
        break;
      case 404:
        console.error('Not Found: The resource was not found.');
        break;
      case 500:
        console.error(
          'Internal Server Error: Something went wrong on the server.'
        );
        break;
      default:
        console.error(`An unexpected error occurred: ${message}`);
    }
  } else {
    console.error('Network error or server is unreachable.');
    toast.error('Network error or server is unreachable.')
  }

  return Promise.reject(error);
}

export const api = createAxiosInstance('application/json');
export const apiFormData = createAxiosInstance('multipart/form-data');
