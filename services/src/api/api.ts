import axios, { AxiosRequestConfig, AxiosRequestHeaders } from 'axios';

import { readStorage, writeStorage, clearStorage } from '@langmate/utils';
import { authApi } from '../auth/requests';
import { STORAGE } from '@langmate/model';
import { API_ENDPOINTS } from './constants';
import { ApiResponse } from './types';
import { RefreshTokenResponse } from '../auth';

declare const __DEV__: boolean;

export const BASE_URL = __DEV__
  ? 'http://10.0.2.2:3000/'
  : 'http://localhost:3000/'; // TODO: from .env

export const apiRequestWithoutAuth = axios.create({
  baseURL: `${BASE_URL}api/`,
});

const apiRequest = axios.create({
  baseURL: `${BASE_URL}api/`,
});

interface RetryQueueItem {
  resolve: (value?: any) => void;
  reject: (error?: any) => void;
  config: AxiosRequestConfig;
}

const refreshAndRetryQueue: RetryQueueItem[] = [];

let isRefreshing = false;

apiRequest.interceptors.request.use(
  async (config) => {
    const access_token = await readStorage(STORAGE.ACCESS_TOKEN);

    if (access_token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${access_token}`,
      } as AxiosRequestHeaders;
    } else {
      return Promise.reject('No access token');
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiRequest.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest: AxiosRequestConfig = error.config;

    if (error.response && error.response.status === 401) {
      // Don't retry logout requests on 401 - just let them fail
      if (originalRequest.url?.includes(API_ENDPOINTS.AUTH.LOGOUT)) {
        return Promise.reject(error);
      }

      const accessToken = await readStorage(STORAGE.ACCESS_TOKEN);
      const refreshToken = await readStorage(STORAGE.REFRESH_TOKEN);

      if (!accessToken || !refreshToken) {
        authApi.logout();

        return Promise.reject(error);
      }

      if (!isRefreshing) {
        isRefreshing = true;
        try {
          // Refresh the access token
          const newTokens = await authApi.refreshTokens({
            refreshToken: refreshToken,
          });

          console.log('api newTokens', newTokens);
          // Save new tokens to storage
          await writeStorage(
            STORAGE.ACCESS_TOKEN,
            newTokens?.data?.accessToken || ''
          );
          await writeStorage(
            STORAGE.REFRESH_TOKEN,
            newTokens?.data?.refreshToken || ''
          );
          // Note: refresh token might also be updated by the server

          // Update the request headers with the new access token
          error.config.headers.Authorization = `Bearer ${newTokens?.data?.accessToken}`;

          // Retry all requests in the queue with the new token
          refreshAndRetryQueue.forEach(({ config, resolve, reject }) => {
            apiRequest
              .request(config)
              .then((response) => resolve(response))
              .catch((err) => reject(err));
          });

          // Clear the queue
          refreshAndRetryQueue.length = 0;

          // Retry the original request
          return apiRequest(originalRequest);
        } catch (refreshError) {
          await clearStorage();
          authApi.logout();

          return Promise.reject(error);
        } finally {
          isRefreshing = false;
        }
      }

      // Add the original request to the queue
      return new Promise<void>((resolve, reject) => {
        refreshAndRetryQueue.push({ config: originalRequest, resolve, reject });
      });
    } else if (error.response && error.response.status === 403) {
      await clearStorage();
      authApi.logout();

      return Promise.reject(error);
    }

    // Return a Promise rejection if the status code is not 401
    return Promise.reject(error);
  }
);

export default apiRequest;
