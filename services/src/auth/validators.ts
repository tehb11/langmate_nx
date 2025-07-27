import { isEmail } from '@langmate/utils';
import * as yup from 'yup';

const rules = {
  email: () =>
    yup
      .string()
      .required('Email is required') // TODO: i18n
      .test('email', 'Invalid email', (value) => {
        return isEmail(value);
      }),
  password: () =>
    yup
      .string()
      .required('Password is required')
      .min(1, 'Password must be at least 6 characters'), // TODO: return 6d
  repeatPassword: () =>
    yup.string().oneOf(
      [yup.ref('password'), ''],
      'Passwords do not match' // TODO: i18n
    ),
};

export const authValidators = {
  UserRegisterUserNamePassword: () =>
    yup.object().shape({
      email: rules.email(),
      password: rules.password(),
      repeatPassword: rules.repeatPassword(),
    }),
  UserLoginEmailPassword: () =>
    yup.object().shape({
      email: rules.email(),
      password: rules.password(),
    }),
};
