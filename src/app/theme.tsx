import { createTheme, responsiveFontSizes } from '@mui/material/styles';

let theme = createTheme({
  palette: {
    primary: {
      light: '#70D1FF',
      main: '#0EA5E9',
      dark: '#0C87C0',
      contrastText: '#FFFFFF',
    },

    // 2. ROYAL PURPLE (Notifications / Tech Lifestyle)
    secondary: {
      light: '#A78BFA',
      main: '#8B5CF6',
      dark: '#7C3AED',
      contrastText: '#FFFFFF',
    },

    // 3. EMERALD GREEN (Cart / Success Actions)
    success: {
      light: '#6EE7B7',
      main: '#10B981',
      dark: '#059669',
      contrastText: '#FFFFFF',
    },

    // 4. SUNSET ORANGE (Account / User Profile)
    warning: {
      light: '#FCD34D',
      main: '#F59E0B',
      dark: '#D97706',
      contrastText: '#FFFFFF',
    },

    // 5. CORAL ROSE (Wishlist / Sale Alerts)
    error: {
      light: '#FDA4AF',
      main: '#F43F5E',
      dark: '#E11D48',
      contrastText: '#FFFFFF',
    },

    // 6. SLATE (Text and UI Borders)
    grey: {
      50: '#F8FAFC',  // Page Background
      100: '#F1F5F9', // Search Bar Background
      200: '#E2E8F0', // Dividers
      700: '#334155', // Main Text / Icons
      900: '#0F172A', // Darkest accents
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