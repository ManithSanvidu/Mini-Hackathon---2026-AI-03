import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem("fg_user");
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  /** Called after a successful login response */
  const login = (userData, token) => {
    localStorage.setItem("fg_token", token);
    localStorage.setItem("fg_user", JSON.stringify(userData));
    setUser(userData);
  };

  /** Clears session */
  const logout = () => {
    localStorage.removeItem("fg_token");
    localStorage.removeItem("fg_user");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/** Convenience hook */
export function useAuth() {
  return useContext(AuthContext);
}
