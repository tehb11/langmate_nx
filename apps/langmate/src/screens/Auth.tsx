import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { StackParamsList } from '../navigation';
import { Theme } from '../theme/types';
import { useStyles } from '../theme/utils';
import Register from '../features/auth/Register';
import Login from '../features/auth/Login';
import { ScreenScroll } from '../shared';
import { ScreenHeader } from '../shared/ui/ScreenHeader';
import { moderateScale } from 'react-native-size-matters';

export type NavigationParams = undefined;

type Props = {
  navigation: StackNavigationProp<StackParamsList, 'Auth'>;
  route: RouteProp<StackParamsList, 'Auth'>;
};

const AuthScreen: React.FC<Props> = ({ navigation }) => {
  const [isLogin, setIsLogin] = useState(false);
  const styles = useStyles(createStyles);

  const handleChangeForm = () => {
    setIsLogin((prev) => !prev);
  };

  return (
    <ScreenScroll styleContainer={styles.container}>
      <ScreenHeader title={isLogin ? 'Login' : 'Register'} />
      {isLogin ? (
        <Login
          onPressChangeFormCb={handleChangeForm}
          styleContainer={styles.contentContainer}
        />
      ) : (
        <Register
          onPressChangeFormCb={handleChangeForm}
          styleContainer={styles.contentContainer}
        />
      )}
    </ScreenScroll>
  );
};

const createStyles = (theme: Theme) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      paddingBottom: moderateScale(20),
    },
    contentContainer: {
      flex: 1,
      justifyContent: 'space-between',
    },
  });

  return styles;
};

export default AuthScreen;
