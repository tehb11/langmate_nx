type StatusBarStyle = 'dark-content' | 'default' | 'light-content';

const light = {
  style: 'dark-content' as StatusBarStyle,
};

const dark = {
  style: 'light-content' as StatusBarStyle,
};

export const statusBar: {light: StatusBar; dark: StatusBar} = {
  light,
  dark,
};

export type StatusBar = typeof light;
