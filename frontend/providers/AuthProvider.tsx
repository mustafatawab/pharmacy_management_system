"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { User } from "@/lib/types";
import api from "@/lib/api";
import { toast } from "react-hot-toast";

interface LoginCredentials {
  username: string;
  password: string;
}

interface RegisterData {
  full_name: string
  username: string;
  password: string;
}

interface AuthContextType {
  user: User | null;
  tenant: any | null;
  loading: boolean;
  login: (credentials: LoginCredentials) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  refreshTenant: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [tenant, setTenant] = useState(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const refreshUser = async () => {
    try {
      const response = await api.get("/auth/me");
      setUser(response.data);
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const refreshTenant = async () => {
    try {
      const response = await api.get("/tenant/me");
      setTenant(response.data);
    } catch (error: any) {
      // Don't show toast if it's just a 401 (not logged in)
      if (error.response?.status !== 401) {
        toast.error("Failed to fetch pharmacy settings");
      }
      setTenant(null);
    } finally {
      setLoading(false);
    }
  };


  useEffect(() => {
    refreshUser();
    refreshTenant();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      await api.post("/auth/login", credentials);
      await refreshUser();
      await refreshTenant();
      toast.success("Login Successful");
      // Flow logic: If no tenant, go to onboarding, else dashboard
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Login Failed");
      throw error;
    }
  };

  const register = async (data: RegisterData) => {
    try {
      await api.post("/auth/register", data);
      await refreshUser();
      toast.success("Registration Successful");
      router.push("/onboarding");
    } catch (error: any) {
      toast.error(error.response?.data?.detail || "Registration Failed");
      throw error;
    }
  };

  const logout = async () => {
    try {
      await api.post("/auth/logout");
      setUser(null);
      toast.success("Logged out successfully");
      router.push("/login");
    } catch (error) {
      toast.error("Logout failed");
    }
  };

  // Automatic routing based on user state
  useEffect(() => {
    if (!loading) {
      if (user) {
        if (!user.tenant_id && window.location.pathname !== "/onboarding") {
          router.push("/onboarding");
        } else if (user.tenant_id && (window.location.pathname === "/login" || window.location.pathname === "/register" || window.location.pathname === "/onboarding")) {
          router.push("/dashboard");
        }
      }
    }
  }, [user, loading, router]);

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser, refreshTenant, tenant }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
