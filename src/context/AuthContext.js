// src/context/AuthContext.js
import React, { createContext, useState, useEffect, useContext } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = sessionStorage.getItem("auth_token");
    console.log("🔑 Token bei App-Start:", token);
    if (token) {
      fetch("http://localhost:5000/api/me", {
        headers: { Authorization: "Bearer " + token }
      })
        .then((res) => {
          if (!res.ok) throw new Error("Token ungültig");
          return res.json();
        })
        .then((userData) => setUser(userData))
        .catch(() => {
          sessionStorage.removeItem("auth_token");
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = ({ token, onLogin }) => {
    sessionStorage.setItem("auth_token", token);
    fetch("http://localhost:5000/api/me", {
      headers: { Authorization: "Bearer " + token }
    })
      .then((res) => {
        if (!res.ok) throw new Error("Fehler bei /me");
        return res.json();
      })
      .then((userData) => {
        setUser(userData);
        if (onLogin) onLogin();
      })
      .catch(() => {
        sessionStorage.removeItem("auth_token");
        setUser(null);
      });
  };

  const logout = () => {
    sessionStorage.removeItem("auth_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

// optionaler Hilfs-Export
export const useAuth = () => useContext(AuthContext);
