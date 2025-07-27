import React, { useCallback, useMemo, useState } from 'react';

import { colors } from './colors';
import { font } from './font';
import { statusBar } from './statusBar';
import { Theme, ThemeName } from './types';

export const lightTheme = {
  id: 'light',
  statusBar: statusBar.light,
  color: colors.light,
  font,
};

export const darkTheme: Theme = {
  ...lightTheme,
  id: 'dark',
  statusBar: statusBar.dark,
  color: colors.dark,
};

export const themes = {
  light: lightTheme,
  dark: darkTheme,
};

interface ThemeContextT {
  theme: Theme;
  getThemeName: () => ThemeName;
  setTheme: (themeName: ThemeName) => void;
}

export const ThemeContext = React.createContext<ThemeContextT>({
  theme: themes.light,
  setTheme: (_theme: ThemeName) => {
    console.log('setTheme', _theme);
  },
  getThemeName: () => 'light',
});

export const ThemeProvider = React.memo<{ children?: React.ReactNode }>(
  ({ children }) => {
    const [themeName, setThemeName] = useState<ThemeName>(
      //Appearance.getColorScheme() || 'light',
      'light',
    );

    const getThemeName = useCallback(() => themeName, [themeName]);

    const setTheme = useCallback((newThemeName: ThemeName) => {
      setThemeName(newThemeName);
    }, []);

    const memoValue = useMemo(() => {
      const value: ThemeContextT = {
        theme: themes[themeName],
        getThemeName,
        setTheme,
      };

      return value;
    }, [getThemeName, setTheme, themeName]);

    return (
      <ThemeContext.Provider value={memoValue}>
        {children}
      </ThemeContext.Provider>
    );
  },
);

export * from './opacity';
