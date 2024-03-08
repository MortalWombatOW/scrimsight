import {alpha, getContrastRatio} from '@mui/material/styles';

interface MuiThemeColor {
  main: string;
  light: string;
  dark: string;
  contrastText: string;
}

export const generateThemeColor = (base: string): MuiThemeColor => {
  return {
    main: alpha(base, 0.7),
    light: alpha(base, 0.9),
    dark: alpha(base, 0.5),
    contrastText:
      getContrastRatio(alpha(base, 0.7), '#000') >= 4.5 ? '#000' : '#fff',
  };
};
