import {ThemeOptions} from '@mui/material';

export const themeDef: ThemeOptions = {
  palette: {
    mode: 'dark',
    primary: {
      // main: '#32466d',
      main: '#2190fe',
    },
    secondary: {
      // main: '#BFDBF7',
      main: '#f9a01a',
      contrastText: '#32466d',
    },
    info: {
      main: '#ffd586',
      contrastText: 'rgba(57,40,12,0.87)',
    },
    error: {
      main: '#BA1200',
    },
    success: {
      main: '#659157',
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
