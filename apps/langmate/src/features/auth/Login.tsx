import React, { useCallback, useContext, useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View, ViewStyle } from 'react-native';
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
  LoginParams,
  LoginResponse,
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

const Login: React.FC<Props> = ({
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
      },

      validationSchema: authValidators.UserLoginEmailPassword,

      onSubmit: () => {
        console.log('Login onSubmit values', values);
        handleLogin(values);
      },
    });

  const handleLogin = useCallback(async (params: LoginParams) => {
    console.log('Login handleLogin params', params);
    try {
      setIsFetching(true);
      const loginResponse: ApiResponse<LoginResponse> = (await authApi.login(
        params,
      )) as never as ApiResponse<LoginResponse>;

      if (loginResponse) {
        console.log('Login userData', loginResponse);
        store.setState((state: GlobalState) => ({
          ...state,
          auth: {
            ...state.auth,
            isAuth: true,
          },
        }));

        writeStorage(
          STORAGE.ACCESS_TOKEN,
          loginResponse?.data?.accessToken || '',
        );
        writeStorage(
          STORAGE.REFRESH_TOKEN,
          loginResponse?.data?.refreshToken || '',
        );
      }
    } catch (error) {
      if (isAxiosError(error)) {
        alert.show({
          title: 'Error',
          message: error?.response?.data?.message || 'Try later',
        });
      }
    }
    setIsFetching(false);
  }, []);

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
      </View>

      <View>
        <CustomButton
          isDisabled={isFetching || !isValid}
          title="Sign in"
          onPress={() => handleSubmit()}
          styleContainer={styles.button}
        />
        <CustomButton
          title="Register form"
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

export default Login;
