export type User = {
  id: string;
  email: string;
  username: string;
  firstName: string;
  lastName: string;
};

export type Auth = {
  accessToken: string;
  refreshToken: string;
  isAuth?: boolean;
};
