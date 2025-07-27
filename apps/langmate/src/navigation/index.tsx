import React from 'react';
import { SvgProps } from 'react-native-svg';
import {
  BottomTabBarProps,
  createBottomTabNavigator,
} from '@react-navigation/bottom-tabs';
import {
  NavigationContainer,
  NavigationContainerRef,
} from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';

import TabBar from '../shared/ui/TabBar';
import AuthScreen, {
  NavigationParams as AuthNavigationParams,
} from '../screens/Auth';
import UsersScreen, {
  NavigationParams as UsersNavigationParams,
} from '../screens/Users';
import ProfileScreen, {
  NavigationParams as ProfileNavigationParams,
} from '../screens/Profile';

import {
  APP_STACK_ROUTE_NAME,
  TAB_BAR_ROUTE_NAME,
  useDefaultNavigationOptions,
} from './utils';

type ScreenT = {
  [key: string]: React.FC<any>;
};

type TabScreenT = {
  [key: string]: {
    screen: React.FC<any>;
    icon?: React.FC<SvgProps>;
    title: string;
  };
};

const appScreens: ScreenT = {};

const screensWoTabBar: ScreenT = {};

const authScreens: ScreenT = {
  Auth: AuthScreen,
  // TODO: email/sms form code
};

export const tabScreens: TabScreenT = {
  Users: {
    screen: UsersScreen,
    title: 'Пользователи',
  },
  Profile: {
    screen: ProfileScreen,
    title: 'Профиль',
  },
};

export type StackParamsList = {
  [APP_STACK_ROUTE_NAME]: undefined;
  [TAB_BAR_ROUTE_NAME]: undefined;

  Users: UsersNavigationParams;
  Profile: ProfileNavigationParams;
  Auth: AuthNavigationParams;
};

export type TabParamsList = {
  Users: UsersNavigationParams;
  Profile: ProfileNavigationParams;
};

const Tab = createBottomTabNavigator<TabParamsList>();
const Stack = createStackNavigator<StackParamsList>();

const renderTabBar = (props: BottomTabBarProps) => (
  <TabBar tabScreens={tabScreens} {...props} />
);

const Tabs: React.FC = () => {
  return (
    <Tab.Navigator
      initialRouteName="Users"
      tabBar={renderTabBar}
      screenOptions={{
        ...useDefaultNavigationOptions(),
        lazy: false,
      }}
    >
      {Object.keys(tabScreens).map((key) => (
        <Tab.Screen
          key={key}
          name={key as keyof TabParamsList}
          component={tabScreens[key].screen}
        />
      ))}
    </Tab.Navigator>
  );
};

export const AuthStack: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName="Auth"
      screenOptions={useDefaultNavigationOptions()}
    >
      {Object.keys(authScreens).map((key) => {
        const AuthScreen = authScreens[key];

        return (
          <Stack.Screen
            key={key}
            name={key as keyof StackParamsList}
            component={AuthScreen}
          />
        );
      })}
    </Stack.Navigator>
  );
};

const appStackScreens: ScreenT = {
  [TAB_BAR_ROUTE_NAME]: Tabs,
  ...appScreens,
  ...screensWoTabBar,
};

const DefaultAppStack: React.FC = () => {
  return (
    <Stack.Navigator
      initialRouteName={TAB_BAR_ROUTE_NAME}
      screenOptions={useDefaultNavigationOptions()}
    >
      {Object.keys(appStackScreens).map((key) => {
        const AppScreen = appStackScreens[key];

        return (
          <Stack.Screen
            key={key}
            name={key as keyof StackParamsList}
            component={AppScreen}
          />
        );
      })}
    </Stack.Navigator>
  );
};

export const AppStack: React.FC = () => (
  <Stack.Navigator
    initialRouteName={APP_STACK_ROUTE_NAME}
    screenOptions={{
      headerShown: false,
    }}
  >
    <Stack.Screen name={APP_STACK_ROUTE_NAME} component={DefaultAppStack} />
  </Stack.Navigator>
);

const Navigator = ({ children }: { children: React.ReactNode }) => {
  const navigationRef =
    React.useRef<NavigationContainerRef<StackParamsList | TabParamsList>>(null);

  return (
    <NavigationContainer ref={navigationRef}>{children}</NavigationContainer>
  );
};

export default Navigator;
