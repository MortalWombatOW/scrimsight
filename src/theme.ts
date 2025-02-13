import {createTheme, ThemeOptions} from '@mui/material/styles';
import {generateThemeColor} from './lib/palette';
import {heroColors} from './lib/color';

export type ColorKey = keyof typeof heroColors | 'team1' | 'team2' | 'primary' | 'secondary' | 'info' | 'warning' | 'error' | 'success';

export const themeDef: ThemeOptions = createTheme({
  palette: {
    mode: 'dark',
    contrastThreshold: 4.5,
    // The primary color is used for primary interface elements like buttons and tabs.
    primary: generateThemeColor('#ff8921'),
    // The secondary color is used for secondary interface elements like input fields and progress bars.
    secondary: generateThemeColor('#809BCE'),
    // The info color is used for neutral information like helper text.
    info: generateThemeColor('#6D676E'),
    // The warning color is used for warning messages.
    warning: generateThemeColor('#f39c28'),
    // The error color is used for notifications requiring immediate user action.
    error: generateThemeColor('#e00040'),
    // The success color is used for indicating success.
    success: generateThemeColor('#7dc95e'),
    background: {
      default: '#000505',
      paper: '#000505',
    },
    text: {
      primary: '#e9e6dc',
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
      // color: 'rgba(0, 0, 0, 0.54)',
    },
    subtitle2: {
      fontSize: 12,
      // color: 'rgba(0, 0, 0, 0.54)',
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
          minWidth: 'fit-content',
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
});
