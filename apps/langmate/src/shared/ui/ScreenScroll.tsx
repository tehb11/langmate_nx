import React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ScrollViewProps,
  StyleSheet,
  ViewStyle,
} from 'react-native';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';

import { useStyles } from '../../theme/utils';

import Screen from './Screen';
import { Theme } from '../../theme/types';
import { moderateScale } from 'react-native-size-matters';

type Props = ScrollViewProps & {
  children: React.ReactNode;
  styleContainer?: ViewStyle;
  styleContentContainer?: ViewStyle;
};

export const ScreenScroll: React.FC<Props> = ({
  styleContentContainer = {},
  styleContainer = {},
  children,
  ...rest
}) => {
  const insets = useSafeAreaInsets();
  const styles = useStyles(
    createStyles(styleContainer, insets, styleContentContainer ?? {}),
  );

  return (
    <Screen styleContainer={styles.screen}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={moderateScale(10)}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.contentContainer}
          keyboardShouldPersistTaps="handled"
          automaticallyAdjustKeyboardInsets
          {...rest}
        >
          {children}
        </ScrollView>
      </KeyboardAvoidingView>
    </Screen>
  );
};

const createStyles =
  (
    styleContainer: ViewStyle,
    insets: EdgeInsets,
    styleContentContainer: ViewStyle,
  ) =>
  (theme: Theme) => {
    const styles = StyleSheet.create({
      screen: {
        flex: 1,
        ...styleContainer,
      },
      contentContainer: {
        flexGrow: 1,
        ...styleContentContainer,
      },
      keyboardAvoidingView: {
        flex: 1,
      },
    });

    return styles;
  };
