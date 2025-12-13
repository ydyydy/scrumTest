import { jwtDecode } from "jwt-decode";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { useNavigate } from "react-router-dom";

export interface User {
  sub: { value: string };
  email: string;
  roles: string[] | string;
  username: string;
}

interface AuthContextType {
  isLoggedIn: boolean;
  isAdmin: boolean;
  user?: User;
  token?: string;
  loading: boolean;
  login: (token: string) => void;
  logout: () => void;
  setUser?: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<User | undefined>();
  const [token, setToken] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  // Función para determinar si el usuario es admin
  const detectAdmin = (roles: string[] | string): boolean => {
    const roleList = Array.isArray(roles) ? roles : [roles];
    return roleList.map((r) => r.toLowerCase()).includes("admin");
  };

  useEffect(() => {
    const savedToken = localStorage.getItem("token");

    if (savedToken) {
      try {
        const decoded = jwtDecode<User>(savedToken);

        setUser(decoded);
        setToken(savedToken);
        setIsLoggedIn(true);
        setIsAdmin(detectAdmin(decoded.roles));
      } catch (error) {
        console.error("Invalid token", error);
        localStorage.removeItem("token");
      }
    }

    setLoading(false);
  }, []);

  const login = (newToken: string) => {
    try {
      const decoded = jwtDecode<User>(newToken);

      setUser(decoded);
      setToken(newToken);
      setIsLoggedIn(true);
      setIsAdmin(detectAdmin(decoded.roles));
      localStorage.setItem("token", newToken);
    } catch (error) {
      console.error("Decoded error", error);
    }
  };

  const logout = () => {
    setUser(undefined);
    setToken(undefined);
    setIsLoggedIn(false);
    setIsAdmin(false);
    localStorage.removeItem("token");
    navigate("/home");
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        isAdmin,
        user,
        token,
        loading,
        login,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth debe usarse dentro de AuthProvider");
  }
  return context;
}
