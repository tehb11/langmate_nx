import { AxiosResponse } from 'axios';

export interface ApiResponse<T> {
  data: T;
  timestamp: string;
  path: string;
  statusCode: number;
}

// Тип для axios response, который содержит наш ApiResponse
export type AxiosApiResponse<T> = AxiosResponse<ApiResponse<T>>;

export interface ApiError {
  statusCode: number;
  timestamp: string;
  path: string;
  method: string;
  message: string;
  stack: string;
}
