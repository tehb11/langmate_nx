import { Auth, User } from '@langmate/model';

export type RegisterParams = {
  email: string;
  password: string;
  repeatPassword: string;
};

export type RegisterResponse = Auth & User;

export type LoginParams = {
  email: string;
  password: string;
};

export type LoginResponse = Auth & User;

export type LogoutResponse = {
  message: string; // Successfully logged out from all devices
};

export type RefreshTokenResponse = Auth;

export type RefreshTokenParams = Pick<Auth, 'refreshToken'>;
