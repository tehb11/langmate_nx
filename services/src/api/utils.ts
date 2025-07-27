import axios from 'axios';
import { ERROR_MESSAGES } from './constants';
import { ApiError } from './types';

// Утилита для обработки ошибок
export const handleApiError = (error: unknown, operation: string): never => {
  console.error(`API ${operation} error:`, error);

  if (axios.isAxiosError(error)) {
    console.log('utils if 1');
    const apiError = error.response?.data satisfies ApiError;
    if (apiError?.message) {
      console.log('utils if 2');
      console.error(`Error message: ${apiError.message}`);
      throw apiError.message;
    }

    if (error.code === 'ERR_NETWORK') {
      console.log('utils if 3');
      throw ERROR_MESSAGES.NETWORK_ERROR;
    }
  }
  console.log('utils if 4');

  throw `Unexpected error during ${operation}`;
};

// Утилита для валидации ответа
export const validateResponse = <T>(response: any, operation: string): T => {
  if (!response?.data) {
    throw `Invalid response from ${operation}`;
  }
  return response.data;
};
