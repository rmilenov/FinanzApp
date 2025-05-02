// src/context/AuthContext.js
import React, { createContext, useState, useEffect } from "react";

export const AuthContext = createContext();

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Lädt Benutzer + Rechte bei App-Start, falls Token vorhanden
  useEffect(() => {
    const token = localStorage.getItem("auth_token");
    if (token) {
      fetch("/api/me", {
        headers: { Authorization: "Bearer " + token },
      })
        .then((res) => {
          if (!res.ok) throw new Error("Token ungültig");
          return res.json();
        })
        .then((userData) => {
          // userData enthält rights
          setUser(userData);
        })
        .catch(() => {
          localStorage.removeItem("auth_token");
          setUser(null);
        })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  // Login: nur Token vom Server übernehmen, dann Benutzer laden
  const login = ({ token, onLogin }) => {
    localStorage.setItem('auth_token', token);
    fetch('http://localhost:5000/api/me', {
      headers: { Authorization: 'Bearer ' + token }
    })
      .then((res) => {
        if (!res.ok) throw new Error('Fehler bei /me');
        return res.json();
      })
      .then((userData) => {
        setUser(userData);
        if (onLogin) onLogin(); // ✅ navigiere nach erfolgreichem Laden
      })
      .catch(() => {
        localStorage.removeItem('auth_token');
        setUser(null);
      });
  };
  

  // Logout: Token löschen, User auf null setzen
  const logout = () => {
    localStorage.removeItem("auth_token");
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
