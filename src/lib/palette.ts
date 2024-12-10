// import {alpha, getContrastRatio} from '@mui/material/styles';



export const generateThemeColor = (base: string): {main: string} => {
  return {
    main: base,
    // light: alpha(base, 0.9),
    // dark: alpha(base, 0.5),
    // contrastText: getContrastRatio(alpha(base, 0.7), '#000') >= 4.5 ? '#000' : '#fff',
  };
};
