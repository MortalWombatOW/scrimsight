import React from 'react';
import {styled} from '@mui/material/styles';
import MuiButton from '@mui/material/Button';
import MuiTypography from '@mui/material/Typography';

export const Button = styled(MuiButton)(() => ({
  fontFamily: 'Bebas Neue',
  fontSize: '1.2rem',
}));

export const Typography = styled(MuiTypography)(
  ({header}: {header?: boolean}) => ({
    fontFamily: header ? 'Bebas Neue' : 'Bitter',
  }),
);
