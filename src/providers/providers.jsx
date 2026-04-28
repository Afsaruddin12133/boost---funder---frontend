import { BrowserRouter } from "react-router";
import { Toaster } from "react-hot-toast";

/**
 * Providers wraps the entire app with global context providers.
 * Add ThemeProvider, AuthContext, QueryClient, etc. here as the app grows.
 */
export function Providers({ children }) {
  return (
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
  );
}
