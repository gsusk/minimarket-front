"use client"
import { ThemeProvider, CssBaseline } from '@mui/material';
import theme from './theme'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { CartProvider } from './components/CartProvider';

const queryClient = new QueryClient()

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <QueryClientProvider client={queryClient} >
        <CartProvider>
          <ReactQueryDevtools initialIsOpen={false} />
          {children}
        </CartProvider>
      </QueryClientProvider>
    </ThemeProvider>
  );
}
