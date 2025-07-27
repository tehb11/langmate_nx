import React from 'react';
import {
  StyleProp,
  StyleSheet,
  Text,
  TextStyle,
  TouchableOpacity,
  View,
  ViewStyle,
} from 'react-native';
import { moderateScale } from 'react-native-size-matters';
import { useAppNavigation } from '../../navigation/hooks';

type Props = {
  withoutBackButton?: boolean;
  title?: string;
  onBackPress?: () => void;
  containerStyle?: StyleProp<ViewStyle>;
  titleStyle?: StyleProp<TextStyle>;
};

export const NavHeader: React.FC<Props> = React.memo(
  ({ withoutBackButton, onBackPress, title, containerStyle, titleStyle }) => {
    const navigation = useAppNavigation();

    const onBackPressCb = () => {
      if (onBackPress) {
        onBackPress();
      } else {
        navigation.goBack();
      }
    };

    return (
      <View style={[styles.container, containerStyle]}>
        {withoutBackButton ? null : (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={onBackPressCb}
            style={styles.arrowContainer}
          >
            <Text style={styles.arrow}>{'<'}</Text>
          </TouchableOpacity>
        )}
        <View style={styles.flexCenter}>
          {title ? (
            <Text style={[styles.title, titleStyle]}>{title}</Text>
          ) : null}
        </View>
        {withoutBackButton ? null : <View style={styles.arrowContainer} />}
      </View>
    );
  },
);

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: moderateScale(16),
    minHeight: moderateScale(44),
    paddingBottom: moderateScale(14),
  },
  flexCenter: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontWeight: '600',
    fontSize: moderateScale(22),
    color: '#FFFFFF',
  },
  arrowContainer: {
    width: moderateScale(24),
  },
  arrow: {
    fontSize: moderateScale(24),
    color: '#FFFFFF',
  },
});
