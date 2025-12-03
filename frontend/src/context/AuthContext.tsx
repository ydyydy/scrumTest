import { jwtDecode } from "jwt-decode";
import {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";

export interface User {
  sub: string;
  email: string;
  roles: string; // ahora puede ser "admin" o "user"
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

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [user, setUser] = useState<User | undefined>();
  const [token, setToken] = useState<string | undefined>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      try {
        const decoded: User = jwtDecode(savedToken) as User;

        setUser(decoded);
        setToken(savedToken);
        setIsLoggedIn(true);
        setIsAdmin(decoded.roles?.toLowerCase() === "admin");
      } catch (error) {
        console.error("Token inválido", error);
        localStorage.removeItem("token");
      }
    }
    setLoading(false);
  }, []);

  const login = (newToken: string) => {
    try {
      const decoded: User = jwtDecode(newToken) as User;

      setUser(decoded);
      setToken(newToken);
      setIsLoggedIn(true);
      setIsAdmin(decoded.roles?.toLowerCase() === "admin");
      localStorage.setItem("token", newToken);
    } catch (error) {
      console.error("Error al decodificar token", error);
    }
  };

  const logout = () => {
    setUser(undefined);
    setToken(undefined);
    setIsLoggedIn(false);
    setIsAdmin(false);
    localStorage.removeItem("token");
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
  if (!context) throw new Error("useAuth debe usarse dentro de AuthProvider");
  return context;
}
