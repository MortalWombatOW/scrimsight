import { Suspense, useState } from 'react';
import {
  Box,
  CssBaseline
} from '@mui/material';
import { Navigation } from './Navigation';

const DRAWER_WIDTH = 240;

interface LayoutProps {
  children: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />

      <Navigation />

      {/* Main content */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${DRAWER_WIDTH}px)` },
          marginTop: '64px', // Height of AppBar
        }}
      >
        <Suspense fallback={<div>Loading...</div>}>
          {children}
        </Suspense>
      </Box>
    </Box>
  );
}; 