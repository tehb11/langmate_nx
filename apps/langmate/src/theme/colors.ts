const light = {
  background1: '#ffffff',
  background2: '#c6c6c6',

  text1: '#000000',
  text2: '#ffffff',

  gray1: '#E4E4E9',

  icon1: '#000000',

  border1: '#000000',

  red1: '#FF0000',

  green1: '#00FF00',

  blue1: '#0000FF',

  yellow1: '#FFFF00',
};

const dark = {
  ...light,
};

export type Colors = typeof dark;

export const colors: { light: Colors; dark: Colors } = {
  light,
  dark,
};
