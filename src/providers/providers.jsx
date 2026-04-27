import { BrowserRouter } from "react-router";

/**
 * Providers wraps the entire app with global context providers.
 * Add ThemeProvider, AuthContext, QueryClient, etc. here as the app grows.
 */
export function Providers({ children }) {
  return (
    <BrowserRouter>
      {children}
    </BrowserRouter>
  );
}
