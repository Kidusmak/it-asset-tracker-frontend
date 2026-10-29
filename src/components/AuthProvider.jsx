"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { ApiError, api, clearAuth, getAuth, makeToken, setAuth } from "@/lib/api";

const AuthContext = createContext(null);

export function useAuth() {
  return useContext(AuthContext);
}

export default function AuthProvider({ children }) {
  const [auth, setAuthState] = useState(null);
  const [ready, setReady] = useState(false);

  // Read the saved login once, in the browser
  useEffect(() => {
    setAuthState(getAuth());
    setReady(true);
  }, []);

  const login = useCallback(async (username, password) => {
    const token = makeToken(username, password);
    let user;
    try {
      user = await api("/api/auth/me", { token });
    } catch (e) {
      // 404 means the credentials were fine but the backend has no /api/auth/me endpoint yet.
      if (e instanceof ApiError && e.status === 404) {
        user = { id: null, username, role: null };
      } else {
        throw e;
      }
    }
    const next = { token, user };
    setAuth(next);
    setAuthState(next);
    return next;
  }, []);

  const logout = useCallback(() => {
    clearAuth();
    setAuthState(null);
  }, []);

  const value = useMemo(() => {
    const role = auth ? auth.user.role : null;
    return {
      auth,
      user: auth ? auth.user : null,
      ready,
      // role === null means "unknown" (backend without /me): show admin buttons, the server still enforces roles
      isAdmin: !!auth && (role === null || role === "ROLE_ADMIN"),
      login,
      logout,
    };
  }, [auth, ready, login, logout]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
