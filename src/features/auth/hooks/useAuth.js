import { auth, facebookProvider, googleProvider } from "@/lib/firebase";
import { signInWithPopup } from "firebase/auth";
import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router";
import { facebookLogin, googleLogin, loginUser, registerUser } from "../services/auth.service";
import { AUTH_STORAGE_KEY, ROLES, USER_STORAGE_KEY } from "../types/auth.types";

// ─── localStorage helpers ────────────────────────────────────────────────────

function getStoredToken() {
  try {
    return localStorage.getItem(AUTH_STORAGE_KEY);
  } catch {
    return null;
  }
}

function getStoredUser() {
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

// ─── Role → route map ────────────────────────────────────────────────────────

function redirectPathForRole(role) {
  switch (role) {
    case ROLES.INVESTOR: return "/dashboard";
    case ROLES.FOUNDER:  return "/dashboard/founder";
    default:             return "/";
  }
}

// ─── Hook ────────────────────────────────────────────────────────────────────

export function useAuth() {
  const navigate = useNavigate();

  // Restore session from localStorage on first render
  const [token, setToken]     = useState(() => getStoredToken());
  const [user,  setUser]      = useState(() => getStoredUser());
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const isAuthenticated = Boolean(token);
  const role = user?.role ?? ROLES.GUEST;

  // ── Sync state across all useAuth instances ─────────────
  
  useEffect(() => {
    const syncAuth = () => {
      setToken(getStoredToken());
      setUser(getStoredUser());
    };
    window.addEventListener("storage", syncAuth);
    window.addEventListener("auth-change", syncAuth);
    return () => {
      window.removeEventListener("storage", syncAuth);
      window.removeEventListener("auth-change", syncAuth);
    };
  }, []);

  // ── Persist session ─────────────────────────────────────────────────────
  const _persist = useCallback((accessToken, userData) => {
    localStorage.setItem(AUTH_STORAGE_KEY, accessToken);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
    setToken(accessToken);
    setUser(userData);
    window.dispatchEvent(new Event("auth-change"));
  }, []);

  // ── Login ───────────────────────────────────────────────────────────────
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
      throw err; // re-throw so AuthPage can react if needed
    } finally {
      setLoading(false);
    }
  }, [_persist, navigate]);

  // ── Register ────────────────────────────────────────────────────────────
  const register = useCallback(async ({ firstName, lastName, email, password, role: selectedRole }) => {
    setLoading(true);
    setError(null);
    try {
      const res = await registerUser({ firstName, lastName, email, password, role: selectedRole });
      if (!res?.data?.token) throw new Error(res?.message || "Registration failed.");
      
      // Do not log the user in directly. Instead, return success to let the UI prompt them to log in.
      return true;
    } catch (err) {
      setError(err.message || "Something went wrong. Please try again.");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  // ── Social Login ─────────────────────────────────────────────────────────
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

  // ── Logout ──────────────────────────────────────────────────────────────
  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    setToken(null);
    setUser(null);
    window.dispatchEvent(new Event("auth-change"));
    navigate("/login", { replace: true });
  }, [navigate]);

  // ── Helpers ─────────────────────────────────────────────────────────────
  const getUser = useCallback(() => user, [user]);

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
    logout,
    getUser,
    clearError,
  };
}
