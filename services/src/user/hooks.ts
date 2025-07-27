import { useQuery } from '@tanstack/react-query';
import { getProfile } from './requests';

export const useUser = () =>
  useQuery({
    queryKey: ['user'],
    queryFn: getProfile,
  });
