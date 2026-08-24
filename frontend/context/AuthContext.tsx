"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { User } from "@/types/user";
import { api } from "@/lib/api";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: any) => Promise<void>;
  googleLogin: (credential: string) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  // Synchronize localStorage with cookies for 1-year persistence
  const syncSession = (token: string, authUser: any) => {
    if (typeof window === "undefined" || !token) return;
    const maxAge = 31536000; // 365 days (1 year)
    localStorage.setItem("happiwrapz_token", token);
    if (authUser) localStorage.setItem("happiwrapz_user", JSON.stringify(authUser));
    document.cookie = `happiwrapz_session=${token}; path=/; max-age=${maxAge}; SameSite=Lax`;
    document.cookie = `access_token=${token}; path=/; max-age=${maxAge}; SameSite=Lax`;
    document.cookie = `happiwrapz_token=${token}; path=/; max-age=${maxAge}; SameSite=Lax`;
  };

  const refreshUser = async () => {
    let localUser: User | null = null;
    let localToken: string | null = null;

    if (typeof window !== "undefined") {
      localToken = localStorage.getItem("happiwrapz_token");
      const userStr = localStorage.getItem("happiwrapz_user");
      if (userStr) {
        try {
          localUser = JSON.parse(userStr);
          setUser(localUser);
        } catch (_) {}
      }
      if (localToken) {
        syncSession(localToken, localUser);
      }
    }

    try {
      const response = await api.get("/auth/me");
      const fetchedUser = response.data?.user || response.user || null;
      if (fetchedUser) {
        setUser(fetchedUser);
        if (typeof window !== "undefined") {
          localStorage.setItem("happiwrapz_user", JSON.stringify(fetchedUser));
        }
      } else if (!localUser) {
        setUser(null);
      }
    } catch (err: any) {
      // If network fails, preserve localUser session so user is never logged out
      if (!localUser) {
        setUser(null);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (email: string, password: string) => {
    const res = await api.post("/auth/login", { email, password });
    const authUser = res.data?.user || res.user;
    const token = res.data?.token || res.token || res.accessToken;
    if (token) {
      syncSession(token, authUser);
    }
    setUser(authUser);
  };

  const register = async (data: any) => {
    const res = await api.post("/auth/register", data);
    const authUser = res.data?.user || res.user;
    const token = res.data?.token || res.token || res.accessToken;
    if (token) {
      syncSession(token, authUser);
    }
    setUser(authUser);
  };

  const googleLogin = async (credential: string) => {
    const res = await api.post("/auth/google", { credential });
    const authUser = res.data?.user || res.user;
    const token = res.data?.token || res.token || res.accessToken;
    if (token) {
      syncSession(token, authUser);
    }
    setUser(authUser);
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (_) {}
    if (typeof window !== "undefined") {
      localStorage.removeItem("happiwrapz_token");
      localStorage.removeItem("happiwrapz_user");
      document.cookie = "happiwrapz_session=; path=/; max-age=0";
      document.cookie = "access_token=; path=/; max-age=0";
      document.cookie = "happiwrapz_token=; path=/; max-age=0";
    }
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, googleLogin, logout, refreshUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
