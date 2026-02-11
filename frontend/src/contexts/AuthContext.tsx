import React, { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { usuarioApi, LoginRequest, UsuarioResponse } from "@/services/api";

interface AuthContextType {
  usuario: UsuarioResponse | null;
  token: string | null;
  login: (data: LoginRequest) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [usuario, setUsuario] = useState<UsuarioResponse | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("usuario");
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUsuario(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  const login = async (data: LoginRequest) => {
    const res = await usuarioApi.login(data);
    setToken(res.token);
    setUsuario(res.usuario);
    localStorage.setItem("token", res.token);
    localStorage.setItem("usuario", JSON.stringify(res.usuario));
  };

  const logout = () => {
    setToken(null);
    setUsuario(null);
    localStorage.removeItem("token");
    localStorage.removeItem("usuario");
  };

  return (
    <AuthContext.Provider value={{ usuario, token, login, logout, isAuthenticated: !!token, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
