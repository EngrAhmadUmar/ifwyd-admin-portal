"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  AuthUser,
  clearTokens,
  getAccessToken,
  getRefreshToken,
  saveTokens,
} from "@/lib/auth";

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? "";

interface AuthState {
  user: AuthUser | null;
  isLoading: boolean;
}

interface AuthContextValue extends AuthState {
  login: (email: string, password: string) => Promise<string | null>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

/** Base64url-encode a JSON payload — enough to satisfy the JWT-shaped decode in middleware.ts. */
function fakeJwt(payload: Record<string, unknown>): string {
  const header = btoa(JSON.stringify({ alg: "none", typ: "JWT" }));
  const body = btoa(JSON.stringify(payload));
  return `${header}.${body}.dev`;
}

/**
 * Dev-only stand-in for the real backend login. Lets the portal be clicked
 * through before the API exists — remove once NEXT_PUBLIC_API_URL points at
 * a real backend (this never runs in production builds).
 */
function devFallbackLogin(email: string): { user: AuthUser; accessToken: string; refreshToken: string } {
  const user: AuthUser = { id: "dev-admin", email, role: "admin", status: "active" };
  const exp = Math.floor(Date.now() / 1000) + 60 * 60 * 24 * 7;
  const accessToken = fakeJwt({ user_id: user.id, role: user.role, user, exp, iat: Math.floor(Date.now() / 1000) });
  return { user, accessToken, refreshToken: "dev-refresh-token" };
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({ user: null, isLoading: true });

  // On mount, validate any stored token by decoding it client-side.
  // We don't make a network call here — the middleware already guards routes.
  useEffect(() => {
    const token = getAccessToken();
    if (!token) {
      setState({ user: null, isLoading: false });
      return;
    }
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload.exp * 1000 < Date.now()) {
        clearTokens();
        setState({ user: null, isLoading: false });
        return;
      }
      setState({
        user: payload.user ?? { id: payload.user_id, role: payload.role ?? "admin", status: "active" },
        isLoading: false,
      });
    } catch {
      clearTokens();
      setState({ user: null, isLoading: false });
    }
  }, []);

  const login = useCallback(async (email: string, password: string): Promise<string | null> => {
    if (!API_URL) {
      if (process.env.NODE_ENV === "development") {
        const { user, accessToken, refreshToken } = devFallbackLogin(email);
        saveTokens(accessToken, refreshToken);
        setState({ user, isLoading: false });
        return null;
      }
      return "NEXT_PUBLIC_API_URL is not set.";
    }

    try {
      const res = await fetch(`${API_URL}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        return data.error ?? "Login failed";
      }

      const { role } = data.user ?? {};
      if (!["admin"].includes(role)) {
        return "You do not have permission to access the admin portal";
      }

      saveTokens(data.tokens.access_token, data.tokens.refresh_token);
      setState({ user: data.user, isLoading: false });
      return null;
    } catch {
      if (process.env.NODE_ENV === "development") {
        const { user, accessToken, refreshToken } = devFallbackLogin(email);
        saveTokens(accessToken, refreshToken);
        setState({ user, isLoading: false });
        return null;
      }
      return `Cannot reach API at ${API_URL}.`;
    }
  }, []);

  const logout = useCallback(async () => {
    const refresh = getRefreshToken();
    if (refresh && API_URL) {
      fetch(`${API_URL}/api/auth/logout`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh_token: refresh }),
      }).catch(() => {});
    }
    clearTokens();
    setState({ user: null, isLoading: false });
    router.push("/login");
  }, [router]);

  return (
    <AuthContext.Provider value={{ ...state, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used inside AuthProvider");
  return ctx;
}
