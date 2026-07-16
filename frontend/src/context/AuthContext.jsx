import React, { createContext, useContext, useState } from "react";
import { authService } from "../services/authService";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());
  const [user, setUser] = useState(authService.isAuthenticated() ? authService.getCurrentUser() : null);
  const [role, setRole] = useState(localStorage.getItem("admin_role") || null);

  const login = async (email, password) => {
    const res = await authService.login(email, password);
    if (res.success) {
      setIsAuthenticated(true);
      setUser(authService.getCurrentUser());
      setRole(res.user.role);
    }
    return res;
  };

  const logout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setUser(null);
    setRole(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, role, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}