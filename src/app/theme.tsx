import { createTheme, responsiveFontSizes } from '@mui/material/styles';

let theme = createTheme({
  palette: {
    primary: {
      light: '#70D1FF',
      main: '#0EA5E9',
      dark: '#0C87C0',
      contrastText: '#FFFFFF',
    },
    secondary: {
      light: '#A78BFA',
      main: '#8B5CF6',
      dark: '#7C3AED',
      contrastText: '#FFFFFF',
    },
    success: {
      light: '#6EE7B7',
      main: '#10B981',
      dark: '#059669',
      contrastText: '#FFFFFF',
    },
    warning: {
      light: '#FCD34D',
      main: '#F59E0B',
      dark: '#D97706',
      contrastText: '#FFFFFF',
    },
    error: {
      light: '#FDA4AF',
      main: '#F43F5E',
      dark: '#E11D48',
      contrastText: '#FFFFFF',
    },
    grey: {
      50: '#F8FAFC',
      100: '#F1F5F9',
      200: '#E2E8F0',
      700: '#334155',
      900: '#0F172A',
    }
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#FFFFFF',
          color: '#334155',
          boxShadow: '0px 2px 15px rgba(0,0,0,0.05)',
        },
      },
    },
    MuiIconButton: {
      styleOverrides: {
        root: {
          '&.cart-btn': { color: '#10B981' },
          '&.notif-btn': { color: '#8B5CF6' },
          '&.user-btn': { color: '#F59E0B' },
        },
      },
    },
  },
});

theme = responsiveFontSizes(theme);
export default theme;