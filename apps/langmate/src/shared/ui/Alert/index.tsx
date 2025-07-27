import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  Animated,
  Dimensions,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import { moderateScale } from 'react-native-size-matters';

import { Theme } from '../../../theme/types';
import { useStyles } from '../../../theme/utils';

import AlertButton from './AlertButton';
import { AlertButtonT, AlertParams, IAlert } from './types';

const WINDOW_WIDTH = Dimensions.get('window').width;

export const alert: IAlert = {
  show: () => {
    console.log('alert show');
  },
  hide: () => {
    console.log('alert hide');
  },
};

const AlertComponent = () => {
  const styles = useStyles(createStyles);

  const [isVisible, setIsVisible] = useState(false);
  const [alertTitle, setAlertTitle] = useState('');
  const [alertMessage, setAlertMessage] = useState('');
  const [alertButtons, setAlertButtons] = useState<AlertButtonT[]>([
    { text: 'OK' },
  ]);
  const [isCancelable, setIsCancelable] = useState(true);

  const fadeAnim = useRef(new Animated.Value(0)).current;

  const fadeIn = () => {
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const fadeOut = () => {
    Animated.timing(fadeAnim, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const show = (params: AlertParams) => {
    const { title, message, buttons, cancelable = true } = params;

    if (title) {
      setAlertTitle(title);
    }
    if (cancelable === false) {
      setIsCancelable(false);
    }
    setAlertMessage(message || '');
    if (buttons && buttons.length) {
      setAlertButtons(buttons);
    }
    setIsVisible(true);
    fadeIn();
  };

  const hide = () => {
    fadeOut();
    setTimeout(() => {
      setIsVisible(false);
      clear();
    }, 200);
  };

  const clear = () => {
    setAlertTitle('');
    setAlertMessage('');
    setAlertButtons([{ text: 'OK' }]);
  };

  const onButtonPress = useCallback((button: AlertButtonT) => {
    hide();

    if (button.onPress) {
      button.onPress();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const onBackdropPress = () => {
    if (isCancelable) {
      hide();
    }
  };

  alert.show = show;
  alert.hide = hide;

  useEffect(() => {
    return () => {
      hide();
      clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return isVisible ? (
    <Animated.View style={[styles.fadeContainer, { opacity: fadeAnim }]}>
      <TouchableOpacity
        activeOpacity={1}
        onPress={onBackdropPress}
        style={styles.overlay}
      >
        <TouchableOpacity activeOpacity={1} style={styles.contentWrapper}>
          <View style={styles.contentContainer}>
            {alertTitle ? (
              <Text style={styles.header}>{alertTitle}</Text>
            ) : null}
            {alertMessage ? (
              <Text style={styles.content}>{alertMessage}</Text>
            ) : null}
          </View>
          {alertButtons.map((item, index) => (
            <View key={`${index}_${item.text}`}>
              <AlertButton item={item} onPress={onButtonPress} />
            </View>
          ))}
        </TouchableOpacity>
      </TouchableOpacity>
    </Animated.View>
  ) : null;
};

export default AlertComponent;

const createStyles = (theme: Theme) => {
  const styles = StyleSheet.create({
    fadeContainer: {
      ...StyleSheet.absoluteFillObject,
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
    },
    contentWrapper: {
      backgroundColor: theme.color.background1,
      borderRadius: moderateScale(20),
      width: WINDOW_WIDTH * 0.75,
      overflow: 'hidden',
    },
    contentContainer: {
      paddingHorizontal: moderateScale(15),
      marginBottom: moderateScale(20),
      paddingTop: moderateScale(20),
    },
    content: {
      color: theme.color.text1,
      fontFamily: theme.font.regular,
      fontSize: moderateScale(14),
      textAlign: 'center',
      paddingTop: moderateScale(5),
    },
    header: {
      color: theme.color.text1,
      fontSize: moderateScale(17),
      textAlign: 'center',
      fontFamily: theme.font.bold,
    },
    divider: {
      height: moderateScale(1),
      maxHeight: moderateScale(1),
      flexDirection: 'row',
      backgroundColor: theme.color.gray1,
    },
  });

  return styles;
};
