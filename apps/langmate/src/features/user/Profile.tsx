import React, { useCallback, useContext } from 'react';
import { Button, StyleSheet, Text, View, ViewStyle } from 'react-native';
import { moderateScale } from 'react-native-size-matters';

import { Theme } from '../../theme/types';
import { useStyles } from '../../theme/utils';
import { ScreenScroll } from '../../shared/ui';
import { authApi, GlobalState, store, useUser } from '@langmate/services';
import { ThemeContext } from '../../theme';
import { useQueryClient } from '@tanstack/react-query';
import { clearStorage } from '@langmate/utils';
import { CustomButton } from '../../shared/ui/CustomButton';

type Props = {
  styleContainer?: ViewStyle;
};

export const Profile: React.FC<Props> = ({ styleContainer = {} }) => {
  const styles = useStyles(createStyles(styleContainer));

  const { theme } = useContext(ThemeContext);

  const { data, refetch, isFetching: isFetchingUser } = useUser();

  const queryClient = useQueryClient();

  const handleLogout = useCallback(async () => {
    try {
      const response = await authApi.logout();
      console.log('Profile handleLogout response', response);
    } catch (error) {
      console.log('Profile handleLogout error', error);
    }

    await clearStorage();

    store.setState((state: GlobalState) => ({
      ...state,
      auth: {
        ...state.auth,
        isAuth: false,
      },
    }));

    queryClient.invalidateQueries({ queryKey: ['user'] });
    queryClient.invalidateQueries({ queryKey: ['auth'] });
  }, [queryClient]);

  return (
    <View style={styles.container}>
      <View />

      <View>
        <Text>email: {data?.data?.email}</Text>
        <Text>username: {data?.data?.username}</Text>
        <Text>firstName: {data?.data?.firstName}</Text>
        <Text>lastName: {data?.data?.lastName}</Text>
      </View>

      <CustomButton
        isDisabled={isFetchingUser}
        title="Выйти"
        onPress={handleLogout}
      />
    </View>
  );
};

const createStyles = (styleContainer: ViewStyle) => (theme: Theme) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'space-between',
      ...styleContainer,
    },
  });

  return styles;
};
