import {ThemeOptions} from '@mui/material/styles';
import {generateThemeColor} from './lib/palette';
import {heroColors} from './lib/color';

const heroColorsTheme = Object.entries(heroColors).reduce(
  (acc, [key, value]) => {
    acc[key] = generateThemeColor(value);
    return acc;
  },
  {},
);

export const themeDef: ThemeOptions = {
  palette: {
    mode: 'dark',
    contrastThreshold: 4.5,
    primary: generateThemeColor('#fdad00'),
    secondary: generateThemeColor('#db5a20'),
    info: generateThemeColor('#ffd586'),
    error: generateThemeColor('#CC3F0C'),
    success: generateThemeColor('#9A6D38'),
    custom: generateThemeColor('#ff0000'),
    ...heroColorsTheme,
    team1: generateThemeColor('#78b4c6'),
    team2: generateThemeColor('#fd6ca0'),

    background: {
      default: '#100E13',
      paper: '#100E13',
    },
    text: {
      primary: '#ffffff',
    },
  },
  typography: {
    fontFamily: 'Sintony',
    h1: {
      fontSize: 36,
      fontWeight: 700,
    },
    h2: {
      fontSize: 36,
    },
    h3: {
      fontSize: 16,
      fontWeight: 700,
    },
    h4: {
      fontSize: 16,
    },
    h5: {
      fontSize: 12,
      fontWeight: 700,
    },
    h6: {
      fontSize: 12,
    },
    subtitle1: {
      fontSize: 16,
      color: 'rgba(0, 0, 0, 0.54)',
    },
    subtitle2: {
      fontSize: 12,
      color: 'rgba(0, 0, 0, 0.54)',
    },
    body1: {
      fontSize: 16,
    },
    body2: {
      fontSize: 12,
    },
    button: {
      textTransform: 'none',
    },
  },
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundImage: 'none',
          boxShadow: 'none',
        },
      },
    },
  },
  shape: {
    borderRadius: 8,
  },
};
