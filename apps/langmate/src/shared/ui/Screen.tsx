import React from 'react';
import { StyleSheet, View, ViewProps, ViewStyle } from 'react-native';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';

import { Theme } from '../../theme/types';
import { useStyles } from '../../theme/utils';
import { moderateScale } from 'react-native-size-matters';

export type Props = ViewProps & {
  withoutBottomInset?: boolean;
  withoutTopInset?: boolean;
  styleContainer?: ViewStyle;
};

const Screen: React.FC<Props> = ({
  withoutBottomInset = true,
  withoutTopInset = false,
  styleContainer = {},
  ...rest
}) => {
  const insets = useSafeAreaInsets();

  const style = useStyles(
    createStyles(insets, withoutTopInset, withoutBottomInset, styleContainer),
  );

  return <View {...rest} style={style.screen} />;
};

export default React.memo(Screen) as typeof Screen;

const createStyles =
  (
    insets: EdgeInsets,
    withoutTopInset: boolean,
    withoutBottomInset: boolean,
    styleContainer?: ViewStyle,
  ) =>
  (theme: Theme) => {
    const styles = StyleSheet.create({
      screen: {
        flex: 1,
        paddingLeft: insets.left || moderateScale(16),
        paddingRight: insets.right || moderateScale(16),
        paddingTop: withoutTopInset ? 0 : insets.top,
        paddingBottom: withoutBottomInset
          ? 0
          : insets.bottom || moderateScale(16),
        backgroundColor: theme.color.background1,
        ...styleContainer,
      },
    });

    return styles;
  };
