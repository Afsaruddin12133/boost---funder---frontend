import { auth, facebookProvider, googleProvider } from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import {
  facebookLogin,
  forgotPassword as forgotPasswordService,
  getProfile,
  googleLogin,
  loginUser,
  registerUser,
  resetPassword as resetPasswordService
} from "../services/auth.service";
import { AUTH_STORAGE_KEY, ROLES, USER_STORAGE_KEY } from "../types/auth.types";

// ─── Module-level Cache ──────────────────────────────────────────────────────
let globalFetchPromise = null;

// ─── Storage Helpers ─────────────────────────────────────────────────────────
const storage = {
  getToken: () => {
    try { return localStorage.getItem(AUTH_STORAGE_KEY); } 
    catch { return null; }
  },
  getUser: () => {
    try {
      const raw = localStorage.getItem(USER_STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  },
  setSession: (token, user) => {
    try {
      if (token) localStorage.setItem(AUTH_STORAGE_KEY, token);
      if (user) localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
    } catch (e) {
      // Fail silently in incognito/restricted modes
    }
  },
  clearSession: () => {
    try {
      localStorage.removeItem(AUTH_STORAGE_KEY);
      localStorage.removeItem(USER_STORAGE_KEY);
    } catch (e) {
      // Fail silently
    }
  }
};

// ─── Router Helper ───────────────────────────────────────────────────────────
const redirectPathForRole = (role) => {
  switch (role) {
    case ROLES.INVESTOR: return "/dashboard";
    case ROLES.FOUNDER:  return "/dashboard/founder";
    default:             return "/";
  }
};

// ─── Hook ────────────────────────────────────────────────────────────────────
export function useAuth() {
  const navigate = useNavigate();

  // Initialize state synchronously from storage to prevent UI flicker
  const [token, setToken] = useState(() => storage.getToken());
  const [user, setUser] = useState(() => storage.getUser());
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const isAuthenticated = Boolean(token);
  const role = user?.role ?? ROLES.GUEST;

  // Sync state across browser tabs & hook instances
  useEffect(() => {
    const handleStorageChange = () => {
      setToken(storage.getToken());
      setUser(storage.getUser());
    };

    const handleCustomSync = (e) => setUser(e.detail);

    window.addEventListener("storage", handleStorageChange);
    window.addEventListener("auth-change", handleStorageChange);
    window.addEventListener("auth-user-updated", handleCustomSync);
    
    return () => {
      window.removeEventListener("storage", handleStorageChange);
      window.removeEventListener("auth-change", handleStorageChange);
      window.removeEventListener("auth-user-updated", handleCustomSync);
    };
  }, []);

  // Background fetch full profile (Stale-while-revalidate pattern)
  useEffect(() => {
    if (token && role && role !== ROLES.GUEST && !globalFetchPromise) {
      globalFetchPromise = getProfile(role)
        .then(res => {
          // Check for deeply nested user object
          let freshUser = res?.data?.data?.user || res?.data?.user || res?.data?.data || res?.data;
          
          if (freshUser) {
            storage.setSession(token, freshUser);
            window.dispatchEvent(new CustomEvent("auth-user-updated", { detail: freshUser }));
          }
          return freshUser;
        })
        .catch((err) => {
          if (err?.status === 401 || err?.status === 403) {
            storage.clearSession();
            globalFetchPromise = null;
            setToken(null);
            setUser(null);
            window.dispatchEvent(new Event("auth-change"));
            navigate("/login", { replace: true });
            return;
          }

          // Gracefully ignore transient network errors.
          // The UI will continue to use the cached local storage user safely.
        });
    }
  }, [navigate, token, role]);

  // Internal persistence handler
  const _persist = useCallback((accessToken, userData) => {
    storage.setSession(accessToken, userData);
    setToken(accessToken);
    setUser(userData);
    window.dispatchEvent(new Event("auth-change"));
  }, []);

  // ─── Authentication Handlers ───────────────────────────────────────────────

  const login = useCallback(async ({ email, password }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await loginUser({ email, password });
      if (!res?.data?.token) throw new Error(res?.message || "Login failed.");
      
      _persist(res.data.token, res.data.user);
      navigate(redirectPathForRole(res.data.user?.role), { replace: true });
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [_persist, navigate]);

  const register = useCallback(async (payload) => {
    setLoading(true);
    setError(null);
    try {
      const res = await registerUser(payload);
      if (!res?.data?.token) throw new Error(res?.message || "Registration failed.");
      return true;
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const loginWithGoogle = useCallback(async (selectedRole) => {
    setLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const firebaseToken = await result.user.getIdToken();
      const res = await googleLogin(firebaseToken, selectedRole);
      
      if (!res?.data?.token) throw new Error(res?.message || "Google login failed.");
      
      _persist(res.data.token, res.data.user);
      navigate(redirectPathForRole(res.data.user?.role ?? selectedRole), { replace: true });
    } catch (err) {
      setError(err.message || "Google login failed. Please try again.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [_persist, navigate]);

  const loginWithFacebook = useCallback(async (selectedRole) => {
    setLoading(true);
    setError(null);
    try {
      const result = await signInWithPopup(auth, facebookProvider);
      const firebaseToken = await result.user.getIdToken();
      const res = await facebookLogin(firebaseToken, selectedRole);
      
      if (!res?.data?.token) throw new Error(res?.message || "Facebook login failed.");
      
      _persist(res.data.token, res.data.user);
      navigate(redirectPathForRole(res.data.user?.role ?? selectedRole), { replace: true });
    } catch (err) {
      setError(err.message || "Facebook login failed. Please try again.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, [_persist, navigate]);

  const sendPasswordResetOTP = useCallback(async (email) => {
    setLoading(true);
    setError(null);
    try {
      return await forgotPasswordService(email);
    } catch (err) {
      setError(err.message || "Failed to send OTP.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const confirmPasswordReset = useCallback(async (payload) => {
    setLoading(true);
    setError(null);
    try {
      return await resetPasswordService(payload);
    } catch (err) {
      setError(err.message || "Password reset failed.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const logout = useCallback(() => {
    storage.clearSession();
    globalFetchPromise = null;
    setToken(null);
    setUser(null);
    window.dispatchEvent(new Event("auth-change"));
    navigate("/login", { replace: true });
  }, [navigate]);

  const updateUser = useCallback((userData) => {
    if (!userData) return;
    storage.setSession(storage.getToken(), userData);
    window.dispatchEvent(new CustomEvent("auth-user-updated", { detail: userData }));
  }, []);

  const clearError = useCallback(() => setError(null), []);

  return {
    user,
    token,
    role,
    isAuthenticated,
    loading,
    error,
    login,
    register,
    loginWithGoogle,
    loginWithFacebook,
    sendPasswordResetOTP,
    confirmPasswordReset,
    logout,
    updateUser,
    clearError,
  };
}

