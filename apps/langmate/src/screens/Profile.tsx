import React, { useContext } from 'react';
import { StyleSheet } from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';

import { StackParamsList } from '../navigation';
import { ThemeContext } from '../theme';
import { Theme } from '../theme/types';
import { useStyles } from '../theme/utils';
import { Profile } from '../features/user';
import { ScreenHeader } from '../shared/ui/ScreenHeader';
import { ScreenScroll } from '../shared';

export type NavigationParams = undefined;

type Props = {
  navigation: StackNavigationProp<StackParamsList, 'Profile'>;
  route: RouteProp<StackParamsList, 'Profile'>;
};

const ProfileScreen: React.FC<Props> = ({ navigation }) => {
  const { theme } = useContext(ThemeContext);
  const styles = useStyles(createStyles);

  return (
    <ScreenScroll styleContentContainer={styles.container}>
      <ScreenHeader title="Profile" />
      <Profile styleContainer={styles.contentContainer} />
    </ScreenScroll>
  );
};

export default ProfileScreen;

const createStyles = (theme: Theme) => {
  const styles = StyleSheet.create({
    container: {
      flex: 1,
    },
    contentContainer: {
      paddingVertical: moderateScale(20),
      alignItems: 'center',
    },
  });

  return styles;
};
