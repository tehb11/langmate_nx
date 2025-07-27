import { useStyles } from '../../theme/utils';
import { Theme } from '../../theme/types';
import React, { memo } from 'react';
import {
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from 'react-native';
import { EdgeInsets, useSafeAreaInsets } from 'react-native-safe-area-context';

export enum CustomButtonVariant {
  MAIN = 'main',
  WITHOUT_BACKGROUND = 'withoutBackground',
}

export type CustomButtonProps = TouchableOpacityProps & {
  title: string;
  styleText?: TextStyle;
  styleContainer?: ViewStyle;
  variant?: CustomButtonVariant;
  leftIcon?: React.ReactNode | null;
  rightIcon?: React.ReactNode | null;
  isDisabled?: boolean;
};

export const CustomButton: React.FC<CustomButtonProps> = memo(
  ({
    title = 'Кнопка',
    styleText = {},
    styleContainer = {},
    variant = CustomButtonVariant.MAIN,
    leftIcon = null,
    rightIcon = null,
    isDisabled = false,
    ...props
  }) => {
    const insets = useSafeAreaInsets();
    const styles = useStyles(
      createStyles(insets, variant, styleContainer, isDisabled),
    );

    return (
      <TouchableOpacity
        style={styles.container}
        {...props}
        disabled={isDisabled}
      >
        {leftIcon}
        <Text style={styles.titleText}>{title}</Text>
        {rightIcon}
      </TouchableOpacity>
    );
  },
);

const createStyles =
  (
    insets: EdgeInsets,
    variant: CustomButtonVariant,
    styleContainer: ViewStyle,
    isDisabled: boolean,
  ) =>
  (theme: Theme) => {
    const styles = StyleSheet.create({
      container: {
        flexDirection: 'row',
        flexShrink: 1,
        minHeight: 48,
        alignSelf: 'stretch',
        justifyContent: 'center',
        alignItems: 'center',
        ...(variant === CustomButtonVariant.MAIN && {
          backgroundColor: theme.color.blue1,
        }),
        ...(variant === CustomButtonVariant.WITHOUT_BACKGROUND && {
          backgroundColor: 'transparent',
          paddingVertical: 6,
          alignItems: 'center',
        }),
        ...(isDisabled && {
          backgroundColor: theme.color.gray1,
          opacity: 0.5,
        }),
        ...styleContainer,
      },
      titleText: {
        fontFamily: theme.font.bold,
        ...(variant === CustomButtonVariant.MAIN && {
          color: theme.color.text2,
        }),
        ...(variant === CustomButtonVariant.WITHOUT_BACKGROUND && {
          color: theme.color.text1,
        }),
        ...(isDisabled && {
          color: theme.color.text1,
        }),
      },
    });
    return styles;
  };
