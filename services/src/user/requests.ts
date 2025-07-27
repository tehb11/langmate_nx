import { User } from '@langmate/model';
import apiRequest from '../api/api';
import { API_ENDPOINTS } from '../api/constants';
import { AxiosApiResponse } from '../api';
import { ProfileResponse, UsersResponse } from './types';

export const getUsers = async () => {
  const response: AxiosApiResponse<UsersResponse> = await apiRequest.get(
    API_ENDPOINTS.USER.USERS
  );
  console.log('requests getUsers  Here', response);
  return response.data;
};

export const getProfile = async () => {
  const response: AxiosApiResponse<ProfileResponse> = await apiRequest.get(
    API_ENDPOINTS.USER.PROFILE
  );
  console.log('requests getProfile  Here', response);
  return response.data;
};

export const userApi = {
  getProfile,
  getUsers,
};
