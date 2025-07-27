import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import Screen from '../shared/ui/Screen';
import { StackParamsList } from '../navigation';
import { ThemeContext } from '../theme';
import { Theme } from '../theme/types';
import { useStyles } from '../theme/utils';
import { UsersList } from '../features/user/UsersList';

export type NavigationParams = undefined;

type Props = {
  navigation: StackNavigationProp<StackParamsList, 'Users'>;
  route: RouteProp<StackParamsList, 'Users'>;
};

const UsersScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useContext(ThemeContext);
  const styles = useStyles(createStyles);

  return (
    <Screen>
      <UsersList />
    </Screen>
  );
};

export default UsersScreen;

const createStyles = (theme: Theme) => {
  const styles = StyleSheet.create({});

  return styles;
};
