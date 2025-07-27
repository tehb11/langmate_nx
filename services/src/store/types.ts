import { Auth, User } from '@langmate/model';

export type GlobalState = {
  app: {
    themeScheme: 'light' | 'dark';
  };
  auth: Auth;
  user: User | null;
};
