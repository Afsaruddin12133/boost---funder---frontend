import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "react-hot-toast";
import { BrowserRouter } from "react-router";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

/**
 * Providers wraps the entire app with global context providers.
 * Add ThemeProvider, AuthContext, QueryClient, etc. here as the app grows.
 */
export function Providers({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        {children}
        <Toaster 
          position="top-center"
          toastOptions={{
            style: {
              background: '#0c0c0c',
              color: '#fff',
              border: '1px solid rgba(255,255,255,0.1)'
            }
          }}
        />
      </BrowserRouter>
    </QueryClientProvider>
  );
}
