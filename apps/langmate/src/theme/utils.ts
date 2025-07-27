import {useContext, useMemo} from 'react';

import {Theme} from './types';
import {ThemeContext} from '.';

type Fn<T extends {}> = (theme: Theme) => T;

export const useStyles = <T extends {}>(fn: Fn<T>) => {
  const {theme} = useContext(ThemeContext);

  const result = useMemo(() => fn(theme), [fn, theme]);

  return result;
};

export const useTheme = (): Theme => {
  const {theme} = useContext(ThemeContext);

  return theme;
};
