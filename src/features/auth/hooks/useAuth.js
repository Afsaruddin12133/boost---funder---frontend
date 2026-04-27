import { useState, useCallback } from "react";
import { AUTH_STORAGE_KEY, USER_STORAGE_KEY, ROLES } from "../types/auth.types";

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

export function useAuth() {
  const [token, setToken] = useState(() => getStoredToken());
  const [user, setUser] = useState(() => getStoredUser());

  const isAuthenticated = Boolean(token);
  const role = user?.role ?? ROLES.GUEST;

  const login = useCallback((userData, accessToken) => {
    localStorage.setItem(AUTH_STORAGE_KEY, accessToken);
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(userData));
    setToken(accessToken);
    setUser(userData);
  }, []);

  const logout = useCallback(() => {
    localStorage.removeItem(AUTH_STORAGE_KEY);
    localStorage.removeItem(USER_STORAGE_KEY);
    setToken(null);
    setUser(null);
  }, []);

  const getDashboardRoute = useCallback((userRole = role) => {
    switch (userRole) {
      case ROLES.INVESTOR:   return "/deals";
      case ROLES.FOUNDER:    return "/dashboard/founder";
      case ROLES.ADMIN:      return "/admin";
      default:               return "/";
    }
  }, [role]);

  return {
    user,
    token,
    role,
    isAuthenticated,
    login,
    logout,
    getDashboardRoute,
  };
}
