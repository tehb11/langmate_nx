import React, { useEffect, useState } from 'react';
import { StatusBar, StyleSheet, View } from 'react-native';
import Navigator, { AppStack, AuthStack } from './navigation';
import { readStorage } from '@langmate/utils';
import { STORAGE } from '@langmate/model';
import { store, useAppStore } from '@langmate/services';
import { Providers } from './shared/providers';
import Alert from './shared/ui/Alert';

if (__DEV__) {
  require('../reactotronConfig');
}

const App: React.FC = () => {
  const [isInitialized, setIsInitialized] = useState(false); // TODO: splah screen?

  const { auth } = useAppStore();

  const getInitialData = async () => {
    const refreshTokenFromStorage = await readStorage(STORAGE.REFRESH_TOKEN);

    store.setState((state) => ({
      ...state,
      auth: {
        ...state.auth,
        isAuth: !!refreshTokenFromStorage,
        refreshToken: refreshTokenFromStorage || '',
      },
    }));
    setIsInitialized(true);
  };

  useEffect(() => {
    getInitialData();
  }, []);

  console.log('App auth.isAuth', auth.isAuth);
  return (
    <Providers>
      <View style={styles.container}>
        <StatusBar animated translucent backgroundColor="transparent" />
        <Navigator>{auth.isAuth ? <AppStack /> : <AuthStack />}</Navigator>
        <Alert />
      </View>
    </Providers>
  );
};

export default App;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
