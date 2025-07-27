import React, { useContext, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import MaskInput from 'react-native-mask-input';
import { moderateScale } from 'react-native-size-matters';

// import SearchIcon from '../assets/images/icons/search.svg';
import { useStyles } from '../../theme/utils';
import { ThemeContext } from '../../theme';
import { Theme } from '../../theme/types';

export enum CustomInputMask {
  PHONE = 'phone',
  PHONE_OR_EMAIL = 'phone_or_email',
  CREDIT_CARD = 'email',
  DATE_FULL = 'date_full',
  PASSPORT = 'passport',
  CODE = 'code',
  NONE = 'none',
}

export enum CustomInputTheme {
  CLAER = 'clear', // transparent background, black text
  GREY = 'grey', // grey background and border, black text
}

type Props = {
  header?: string;
  error?: string;
  beforeValueText?: string;
  value?: string;
  afterValueText?: string;
  placeholder?: string;
  onChange?: (text: string) => void;
  isSearch?: boolean;
  disabled?: boolean;
  visibleClear?: boolean;
  onPressClearCb?: () => void;
  styleContainer?: ViewStyle;
  styleInputContainer?: ViewStyle;
  styleInput?: TextStyle;
  inputTheme?: CustomInputTheme;
  maxLength?: number;
  maskType?: CustomInputMask;
  isLoading?: boolean;
  onFocusCb?: () => void;
  onBlurCb?: () => void;
  onEndEditingCb?: () => void;
  onSubmitEditingCb?: () => void;
};

export const CustomInput = React.forwardRef<TextInput, Props>(
  (
    {
      header = '',
      error,
      beforeValueText,
      value,
      afterValueText,
      placeholder = 'Введите значение',
      onChange,
      isSearch = false,
      disabled = false,
      visibleClear = false,
      onPressClearCb,
      styleContainer = {},
      styleInputContainer = {},
      styleInput = {},
      inputTheme = CustomInputTheme.GREY,
      maxLength,
      maskType,
      isLoading,
      onFocusCb,
      onBlurCb,
      onEndEditingCb,
      onSubmitEditingCb,
      ...otherProps
    },
    ref,
  ) => {
    const [propsMaskInput, setPropsMaskInput] = useState({});

    const styles = useStyles(createStyles(styleContainer));
    const { theme } = useContext(ThemeContext);

    const inputContainerStyles = useMemo(
      () => [
        styles.inputContainer,
        inputTheme === CustomInputTheme.CLAER
          ? styles.inputContainerClear
          : null,
        {
          paddingBottom:
            maxLength && maskType !== CustomInputMask.CODE
              ? moderateScale(24)
              : 0,
        },
        error ? styles.borderWarning : null,
        disabled ? styles.disabled : null,
        styleInputContainer,
      ],
      [
        disabled,
        error,
        inputTheme,
        maskType,
        maxLength,
        styleInputContainer,
        styles.borderWarning,
        styles.disabled,
        styles.inputContainer,
        styles.inputContainerClear,
      ],
    );

    const inputStyles = useMemo(
      () => [styles.textInput, disabled ? styles.disabled : null, styleInput],
      [disabled, styleInput, styles.disabled, styles.textInput],
    );

    const touchPos = {
      top: 20,
      bottom: 20,
      left: 20,
      right: 20,
    };

    // useEffect(() => {
    //   if (!value) {
    //     setPropsMaskInput({});
    //     return;
    //   }
    //   if (maskType === CustomInputMask.PHONE_OR_EMAIL) {
    //     const firstSymbol = String(value)[0];
    //     if (Number(firstSymbol) >= 1 || firstSymbol === '+') {
    //       setPropsMaskInput({ mask: [] });
    //     } else {
    //       setPropsMaskInput({});
    //     }
    //   } else if (maskType) {
    //     setPropsMaskInput({ mask: [] });
    //   }
    // }, [maskType, value]);

    return (
      <View style={styles.container}>
        {!!header && <Text style={styles.headerText}>{header}</Text>}
        <Pressable
          style={inputContainerStyles}
          onPress={() => {
            if (ref && 'current' in ref) {
              // ref.current?.focus();
            }
          }}
        >
          {!!beforeValueText && (
            <Text
              style={{
                color: theme.color.text1,
                fontFamily: theme.font.regular,
                fontSize: moderateScale(15),
                marginRight: moderateScale(4),
              }}
            >
              {beforeValueText}
            </Text>
          )}

          <MaskInput
            ref={ref}
            editable={!disabled}
            keyboardAppearance="default"
            keyboardType={
              [CustomInputMask.PHONE, CustomInputMask.CODE].includes(
                maskType || CustomInputMask.NONE,
              )
                ? 'numeric'
                : 'default'
            }
            maxLength={maxLength || 500}
            placeholder={placeholder}
            placeholderTextColor={theme.color.text1}
            caretHidden={false}
            value={value}
            style={inputStyles}
            onFocus={onFocusCb || undefined}
            onBlur={onBlurCb || undefined}
            onEndEditing={onEndEditingCb || undefined}
            onSubmitEditing={onSubmitEditingCb || undefined}
            {...otherProps}
            onChangeText={(masked) => {
              onChange?.(masked);
            }}
            numberOfLines={1}
            {...propsMaskInput}
          />
          {!!afterValueText && (
            <Text
              style={{
                color: theme.color.text1,
                fontFamily: theme.font.bold,
                fontSize: moderateScale(15),
              }}
            >
              {afterValueText}
            </Text>
          )}

          {!!maxLength && maskType !== CustomInputMask.CODE && (
            <View style={styles.maxLengthContainer}>
              <Text style={styles.maxLengthText}>
                {String(value).length
                  ? `${String(value).length}/${maxLength}`
                  : maxLength}
              </Text>
            </View>
          )}

          {visibleClear && (
            <TouchableOpacity hitSlop={touchPos} onPress={onPressClearCb}>
              {/* <ClearTextIcon /> */}
            </TouchableOpacity>
          )}
          {isLoading && <ActivityIndicator />}
        </Pressable>

        {!!error && (
          <Text
            style={styles.errorText}
            adjustsFontSizeToFit
            minimumFontScale={0.5}
          >
            {error}
          </Text>
        )}
      </View>
    );
  },
);

const createStyles = (styleContainer: ViewStyle) => (theme: Theme) => {
  const styles = StyleSheet.create({
    container: {
      justifyContent: 'center',
      alignSelf: 'stretch',
      ...styleContainer,
    },
    headerText: {
      marginBottom: moderateScale(8),
      fontFamily: theme.font.bold,
      color: theme.color.text1,
      fontSize: moderateScale(20),
    },
    textInput: {
      color: theme.color.text1,
      flex: 1,
      fontSize: moderateScale(15),
      fontFamily: theme.font.regular,
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      minHeight: moderateScale(48),
      backgroundColor: theme.color.background2,
      paddingHorizontal: moderateScale(14),
      borderRadius: moderateScale(16),
    },
    inputContainerClear: {
      borderWidth: 0,
      borderColor: 'transparent',
      backgroundColor: 'transparent',
    },
    searchIconContainer: {
      marginRight: moderateScale(10),
      marginTop: -3,
      marginBottom: -3,
    },
    disabled: {},
    borderWarning: {
      borderColor: theme.color.red1,
      borderWidth: 1,
    },
    maxLengthText: {
      fontSize: moderateScale(12),
      color: theme.color.text1,
      fontFamily: theme.font.regular,
    },
    errorText: {
      fontSize: moderateScale(15),
      marginTop: moderateScale(10),
      fontFamily: theme.font.regular,
      color: theme.color.red1,
    },
    maxLengthContainer: { position: 'absolute', bottom: 8, left: 12 },
  });

  return styles;
};
