import React, { useContext } from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { moderateScale } from 'react-native-size-matters';

import { Theme } from '../../theme/types';
import { useStyles } from '../../theme/utils';
import { ThemeContext } from '../../theme';
import { User } from '@langmate/model';

type Props = {
  item: User;
  styleContainer?: ViewStyle;
};

export const UsersListItem: React.FC<Props> = ({
  item,
  styleContainer = {},
}) => {
  const styles = useStyles(createStyles(styleContainer));

  const { theme } = useContext(ThemeContext);

  // console.log('UsersListItem Here', item);

  return (
    <View style={styles.container}>
      <Text style={styles.text}>id: {item.id}</Text>
      <Text style={styles.text}>email: {item.email}</Text>
    </View>
  );
};

const createStyles = (styleContainer: ViewStyle) => (theme: Theme) => {
  const styles = StyleSheet.create({
    container: {
      flexShrink: 1,
      alignSelf: 'stretch',
      flexDirection: 'row',
      alignItems: 'center',
      gap: moderateScale(10),
      flexWrap: 'wrap',
      borderWidth: 1,
      borderColor: theme.color.border1,
      padding: moderateScale(10),
      ...styleContainer,
    },
    text: {
      fontSize: moderateScale(16),
      color: theme.color.text1,
    },
  });

  return styles;
};
