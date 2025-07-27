import React, { useContext } from 'react';
import { StyleSheet, Text, TouchableHighlight, View } from 'react-native';
import { moderateScale } from 'react-native-size-matters';

import { ThemeContext } from '../../../theme';
import { Theme } from '../../../theme/types';
import { useStyles } from '../../../theme/utils';

import { AlertButtonT } from './types';

type Props = {
  item: AlertButtonT;
  onPress: (button: AlertButtonT) => void;
};

const AlertButton: React.FC<Props> = ({ item, onPress }) => {
  const { theme } = useContext(ThemeContext);
  const styles = useStyles(createStyles);

  const onPressCb = () => onPress && onPress(item);
  return (
    <View>
      <View style={styles.divider} />
      <TouchableHighlight
        activeOpacity={1}
        underlayColor={theme.color.gray1}
        onPress={onPressCb}
        style={styles.container}
      >
        <Text
          style={[
            styles.button,
            item.type === 'danger' ? styles.dangerButton : null,
            item.type === 'highlight' ? styles.highlightedButton : null,
          ]}
        >
          {item.text}
        </Text>
      </TouchableHighlight>
    </View>
  );
};

export default AlertButton;

const createStyles = (theme: Theme) => {
  const styles = StyleSheet.create({
    container: {
      alignItems: 'center',
      justifyContent: 'center',
      height: moderateScale(45),
    },
    divider: {
      height: moderateScale(1),
      maxHeight: moderateScale(1),
      flexDirection: 'row',
      backgroundColor: theme.color.gray1,
    },
    button: {
      color: theme.color.blue1,
      fontSize: moderateScale(17),
      fontFamily: theme.font.regular,
      textAlign: 'center',
      letterSpacing: -0.43,
    },
    highlightedButton: {
      fontFamily: theme.font.semibold,
    },
    dangerButton: {
      color: theme.color.red1,
    },
  });

  return styles;
};
