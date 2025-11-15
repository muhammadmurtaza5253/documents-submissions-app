"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";

interface User {
  id: string;
  username: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Check authentication status on mount
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const user = window.localStorage.getItem("user");
        if (user) {
          setUser(JSON.parse(user));
        } else {
          setUser(null);
        }
        // TODO: Implement proper authentication token management
        // const token = document.cookie
        //   .split("; ")
        //   .find((row) => row.startsWith("auth-token="))
        //   ?.split("=")[1];

        // if (token) {
        //   // Verify token with backend (you can add an API endpoint for this)
        //   // For now, we'll just check if token exists
        //   // You should decode and verify the token properly
        //   const response = await fetch("/api/auth/verify", {
        //     method: "GET",
        //     credentials: "include",
        //   });

        //   if (response.ok) {
        //     const userData = await response.json();
        //     setUser(userData.user);
        //   } else {
        //     // Token is invalid, clear it
        //     document.cookie = "auth-token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
        //     setUser(null);
        //   }
        // } else {
        //   setUser(null);
        // }
      } catch (error) {
        console.error("Error checking auth:", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (username: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ username, password }),
      });

      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        if (window.localStorage) {
          window.localStorage.setItem("user", JSON.stringify({...data.user, loggedIn: true}));
        }
        return true;
      } else {
        const error = await response.json();
        throw new Error(error.message || "Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = async () => {
    try { 
      await fetch("/api/auth/logout", {
        method: "POST",
        credentials: "include",
      });
      setUser(null);
    }
    catch (error) {
      console.error("Logout error:", error);
    }
    router.push("/login");
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    isLoading,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

