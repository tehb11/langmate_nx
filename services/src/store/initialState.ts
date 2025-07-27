import { GlobalState } from './types';

export const initialState: GlobalState = {
  app: {
    themeScheme: 'light',
  },
  auth: {
    isAuth: true,
    accessToken: '',
    refreshToken: '',
  },
  user: {
    id: '',
    username: '',
    firstName: '',
    lastName: '',
    email: '',
  },
};
