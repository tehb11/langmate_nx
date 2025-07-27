import React, { useContext, useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { moderateScale } from 'react-native-size-matters';
import { BottomTabBarProps } from '@react-navigation/bottom-tabs';

import { ThemeContext } from '../../theme';
import { Theme } from '../../theme/types';
import { useStyles } from '../../theme/utils';

type Props = BottomTabBarProps & {
  tabScreens: any;
};

const TAB_BAR_ICON_SIZE = moderateScale(24);
const TAB_BAR_VERTICAL_PADDING = moderateScale(8);

const TabBar: React.FC<Props> = ({
  state,
  descriptors,
  navigation,
  tabScreens,
}) => {
  const { theme } = useContext(ThemeContext);
  const styles = useStyles(createStyles);
  const insets = useSafeAreaInsets();

  return (
    <View>
      <View
        style={useMemo(
          () => [
            styles.container,
            {
              paddingBottom: insets.bottom || moderateScale(15),
            },
          ],
          [insets.bottom, styles.container],
        )}
      >
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];

          const Icon = tabScreens[route.name]?.icon;

          const title = tabScreens[route.name].title;

          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          const onLongPress = () => {
            navigation.emit({
              type: 'tabLongPress',
              target: route.key,
            });
          };

          return (
            <View style={styles.tabContainer} key={route.key}>
              <Pressable
                accessibilityRole="button"
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                onPress={onPress}
                onLongPress={onLongPress}
                style={[styles.tab, !isFocused ? styles.disabledTab : null]}
              >
                <View>
                  {Icon && (
                    <Icon
                      width={TAB_BAR_ICON_SIZE}
                      height={TAB_BAR_ICON_SIZE}
                      fill={theme.color.text1}
                    />
                  )}
                </View>
                <Text style={styles.title}>{title}</Text>
              </Pressable>
            </View>
          );
        })}
      </View>
    </View>
  );
};

export default React.memo(TabBar);

const createStyles = (theme: Theme) => {
  const styles = StyleSheet.create({
    container: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: TAB_BAR_VERTICAL_PADDING,
      paddingHorizontal: moderateScale(7),
      backgroundColor: theme.color.background1,
      borderTopWidth: StyleSheet.hairlineWidth,
      borderColor: theme.color.gray1,
      shadowColor: 'rgba(0, 0, 0, 0.1)',
      shadowRadius: moderateScale(4),
      shadowOffset: {
        width: moderateScale(2),
        height: moderateScale(4),
      },
      shadowOpacity: 1,
    },
    tabContainer: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
    },
    tab: {
      alignItems: 'center',
      flex: 1,
    },
    title: {
      fontFamily: theme.font.regular,
      fontSize: moderateScale(12),
      lineHeight: moderateScale(16),
      textAlign: 'center',
      color: theme.color.text1,
      marginTop: moderateScale(4),
    },
    disabledTab: {
      opacity: 0.4,
    },
  });

  return styles;
};
