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

  const refreshUser = async () => {
    try {
      setLoading(true);
      const response = await api.get("/auth/me");
      const fetchedUser = response.data?.user || response.user || null;
      setUser(fetchedUser);
    } catch (err) {
      setUser(null);
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
    const token = res.data?.token || res.token;
    if (token && typeof window !== "undefined") {
      localStorage.setItem("happiwrapz_token", token);
      localStorage.setItem("happiwrapz_user", JSON.stringify(authUser));
      document.cookie = `happiwrapz_session=${token}; path=/; max-age=2592000; SameSite=Lax`;
      document.cookie = `access_token=${token}; path=/; max-age=2592000; SameSite=Lax`;
    }
    setUser(authUser);
  };

  const register = async (data: any) => {
    const res = await api.post("/auth/register", data);
    const authUser = res.data?.user || res.user;
    const token = res.data?.token || res.token;
    if (token && typeof window !== "undefined") {
      localStorage.setItem("happiwrapz_token", token);
      localStorage.setItem("happiwrapz_user", JSON.stringify(authUser));
      document.cookie = `happiwrapz_session=${token}; path=/; max-age=2592000; SameSite=Lax`;
      document.cookie = `access_token=${token}; path=/; max-age=2592000; SameSite=Lax`;
    }
    setUser(authUser);
  };

  const googleLogin = async (credential: string) => {
    const res = await api.post("/auth/google", { credential });
    const authUser = res.data?.user || res.user;
    const token = res.data?.token || res.token;
    if (token && typeof window !== "undefined") {
      localStorage.setItem("happiwrapz_token", token);
      localStorage.setItem("happiwrapz_user", JSON.stringify(authUser));
      document.cookie = `happiwrapz_session=${token}; path=/; max-age=2592000; SameSite=Lax`;
      document.cookie = `access_token=${token}; path=/; max-age=2592000; SameSite=Lax`;
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
