import { ApiResponse, AxiosApiResponse } from '../api';
import apiRequest, { apiRequestWithoutAuth } from '../api/api';
import {
  LoginParams,
  LoginResponse,
  LogoutResponse,
  RefreshTokenParams,
  RefreshTokenResponse,
  RegisterParams,
  RegisterResponse,
} from './types';
import { API_ENDPOINTS } from '../api/constants';

const register = async (params: RegisterParams) => {
  console.log('api register');
  const response: AxiosApiResponse<RegisterResponse> =
    await apiRequestWithoutAuth.post(API_ENDPOINTS.AUTH.REGISTER, {
      email: params.email,
      password: params.password,
      username: params.email, // TODO: add
      firstName: '',
      lastName: '',
    });

  return response.data;
};

const login = async (params: LoginParams) => {
  const response: AxiosApiResponse<LoginResponse> =
    await apiRequestWithoutAuth.post(API_ENDPOINTS.AUTH.LOGIN, params);

  return response.data;
};

const refreshTokens = async (params: RefreshTokenParams) => {
  console.log('api refreshToken');
  const response: AxiosApiResponse<RefreshTokenResponse> =
    await apiRequest.post('auth/refresh', params);

  return response.data;
};

const logout = async () => {
  console.log('api logout');
  const response: AxiosApiResponse<LogoutResponse> = await apiRequest.post(
    API_ENDPOINTS.AUTH.LOGOUT,
    {}
  );

  return response.data;
};

const logoutDevice = async () => {
  console.log('api logoutDevice');
};

export const authApi = {
  login,
  register,
  refreshTokens,
  logout,
  logoutDevice,
};
