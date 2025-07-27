import React, { useCallback, useContext, useEffect, useState } from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { useQueryClient } from '@tanstack/react-query';

import { Theme } from '../../theme/types';
import { useStyles } from '../../theme/utils';
import { ScreenScroll } from '../../shared/ui';
import { useFormik, writeStorage } from '@langmate/utils';
import {
  ApiResponse,
  authApi,
  authValidators,
  GlobalState,
  RegisterParams,
  RegisterResponse,
  store,
} from '@langmate/services';
import { CustomInput } from '../../shared/ui';
import { ThemeContext } from '../../theme';
import { STORAGE } from '@langmate/model';
import {
  CustomButton,
  CustomButtonVariant,
} from '../../shared/ui/CustomButton';
import { isAxiosError } from 'axios';
import { alert } from '../../shared/ui/Alert';

type Props = {
  onPressChangeFormCb: () => void;
  styleContainer?: ViewStyle;
};

const Register: React.FC<Props> = ({
  onPressChangeFormCb,
  styleContainer = {},
}) => {
  const styles = useStyles(createStyles(styleContainer));

  const [isFetching, setIsFetching] = useState(false);

  const { theme } = useContext(ThemeContext);

  const queryClient = useQueryClient();

  const { handleChange, handleSubmit, values, errors, isValid, setErrors } =
    useFormik({
      initialValues: {
        email: __DEV__ ? 'user@example.com' : '',
        password: __DEV__ ? 'password123' : '',
        repeatPassword: __DEV__ ? 'password123' : '',
      },

      validationSchema: authValidators.UserRegisterUserNamePassword,

      onSubmit: () => {
        console.log('Register onSubmit values', values);
        handleRegister(values);
      },
    });

  console.log('Register isFetching', isFetching);

  const handleRegister = useCallback(
    async (params: RegisterParams) => {
      console.log('Register handleRegister params', params);
      try {
        setIsFetching(true);
        const registerResponse: ApiResponse<RegisterResponse> =
          (await authApi.register(
            params,
          )) as never as ApiResponse<RegisterResponse>;

        console.log('Register 123');
        if (registerResponse) {
          console.log('Register userData', registerResponse);
          store.setState((state: GlobalState) => ({
            ...state,
            auth: {
              ...state.auth,
              isAuth: true,
            },
          }));

          writeStorage(
            STORAGE.ACCESS_TOKEN,
            registerResponse?.data?.accessToken || '',
          );
          writeStorage(
            STORAGE.REFRESH_TOKEN,
            registerResponse?.data?.refreshToken || '',
          );
        }
      } catch (error) {
        if (isAxiosError(error)) {
          alert.show({
            title: 'Error',
            message: error?.response?.data?.message || 'Try later',
          });
          if (
            error?.response?.data?.message ===
            'User with this email or username already exists'
          ) {
            setErrors({
              email: 'User with this email or username already exists',
            });
          }
        } else {
          console.log('Register error:', error);
        }
      }

      setIsFetching(false);
    },
    [setErrors],
  );

  useEffect(() => {
    queryClient.clear();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <View style={styles.container}>
      <View />

      <View>
        <CustomInput
          header="Email"
          value={values.email}
          error={errors.email}
          onChange={handleChange('email')}
        />
        <CustomInput
          header="Password"
          value={values.password}
          error={errors.password}
          onChange={handleChange('password')}
        />
        <CustomInput
          header="Repeat password"
          value={values.repeatPassword}
          error={errors.repeatPassword}
          onChange={handleChange('repeatPassword')}
        />
      </View>

      <View>
        <CustomButton
          isDisabled={isFetching || !isValid}
          title="Sign up"
          onPress={() => handleSubmit()}
          styleContainer={styles.button}
        />
        <CustomButton
          title="Login form"
          onPress={onPressChangeFormCb}
          variant={CustomButtonVariant.WITHOUT_BACKGROUND}
          styleContainer={styles.button}
        />
      </View>
    </View>
  );
};

const createStyles = (styleContainer: ViewStyle) => (theme: Theme) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      ...styleContainer,
    },

    button: {
      marginTop: moderateScale(16),
    },
  });

  return styles;
};

export default Register;
