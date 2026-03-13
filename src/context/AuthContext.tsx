import { createContext, useContext, useState, useEffect } from "react";
import type { FC, ReactNode } from "react";
import { authService } from "../api/auth.service";

interface User {
  id: string;
  name: string;
  email: string;
  avatarURL?: string;
  dark?: boolean;
  qrStyle?: any;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  isDarkMode: boolean;
  login: (token: string, user: User) => void;
  logout: () => void;
  setDarkMode: (dark: boolean) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token"),
  );
  const [loading, setLoading] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem("artnode_darkmode");
    return saved !== null ? saved === "true" : true;
  });

  useEffect(() => {
    if (!isDarkMode) {
      document.documentElement.classList.add("light");
    } else {
      document.documentElement.classList.remove("light");
    }
    localStorage.setItem("artnode_darkmode", String(isDarkMode));
  }, [isDarkMode]);

  useEffect(() => {
    const verifyToken = async () => {
      if (token) {
        try {
          const response: any = await authService.getProfile();
          const u = response.data.data;
          if (u) {
            setUser(u);
            if (u.dark !== undefined) {
              setIsDarkMode(u.dark);
            }
          }
        } catch (error: any) {
          if (error.response?.status === 401) {
            logout();
          }
        }
      }
      setLoading(false);
    };

    verifyToken();
  }, []);

  const login = (newToken: string, newUser: User) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setUser(newUser);
    if (newUser.dark !== undefined) {
      setIsDarkMode(newUser.dark);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setUser(null);
  };

  const setDarkMode = (dark: boolean) => {
    setIsDarkMode(dark);
  };

  return (
    <AuthContext.Provider
      value={{ user, token, loading, isDarkMode, login, logout, setDarkMode }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
