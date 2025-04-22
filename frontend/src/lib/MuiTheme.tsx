'use client';

import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ReactNode } from 'react';

// Define your brand colors here
const primaryColor = {
  main: '#2E7D32', // Forest green - perfect for a food/recipe app
  light: '#60ad5e',
  dark: '#005005',
  contrastText: '#ffffff',
};

const secondaryColor = {
  main: '#FF8A65', // Coral - complementary to green and food-related
  light: '#FFB893',
  dark: '#C75B39',
  contrastText: '#000000',
};

// Create a theme instance
const theme = createTheme({
  palette: {
    mode: 'light',
    primary: primaryColor,
    secondary: secondaryColor,
    background: {
      default: '#f9f9f9',
      paper: '#ffffff',
    },
    text: {
      primary: '#171717',
    },
    // You can add more color customizations here
    error: {
      main: '#d32f2f',
    },
    warning: {
      main: '#ffa000',
    },
    info: {
      main: '#0288d1',
    },
    success: {
      main: '#388e3c',
    },
  },
  typography: {
    fontFamily: 'var(--font-geist-sans)',
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          fontFamily: 'var(--font-geist-sans)',
          WebkitFontSmoothing: 'antialiased',
          MozOsxFontSmoothing: 'grayscale',
        },
      },
    },
  },
});

interface MuiProviderProps {
  children: ReactNode;
}

export function MuiProvider({ children }: MuiProviderProps) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  );
}
