import { useQuery } from '@tanstack/react-query';
import { userApi } from './requests';

export const useUser = () =>
  useQuery({
    queryKey: ['user'],
    queryFn: userApi.getProfile,
  });

export const useUsers = () =>
  useQuery({
    queryKey: ['users'],
    queryFn: userApi.getUsers,
  });
