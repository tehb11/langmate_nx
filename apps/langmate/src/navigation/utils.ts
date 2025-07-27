import {useContext, useMemo} from 'react';
import {
  CardStyleInterpolators,
  StackNavigationOptions,
  StackNavigationProp,
} from '@react-navigation/stack';

import {ThemeContext} from '../theme';

import {StackParamsList} from '.';

export const TAB_BAR_ROUTE_NAME = 'Tabs';
export const APP_STACK_ROUTE_NAME = 'App';

export const defaultNavigationOptions: {
  headerShown: boolean;
  cardOverlayEnabled: StackNavigationOptions['cardOverlayEnabled'];
  cardStyleInterpolator: StackNavigationOptions['cardStyleInterpolator'];
} = {
  headerShown: false,
  cardOverlayEnabled: true,
  cardStyleInterpolator: CardStyleInterpolators.forHorizontalIOS,
};

export function useDefaultNavigationOptions() {
  const {theme} = useContext(ThemeContext);

  const defaultOptions = useMemo(
    () => ({
      ...defaultNavigationOptions,
      cardStyle: {
        backgroundColor: theme.color.background1,
      },
    }),
    [theme.color.background1],
  );

  return defaultOptions;
}

export type AppNavigationProp = StackNavigationProp<StackParamsList>;
