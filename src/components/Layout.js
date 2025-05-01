// src/components/Layout.js
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from './Auth';
import '../index.css';

const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  // Hilfsfunktion zur Rechteprüfung
  const hasRight = (area, level = 'read') => {
    return user?.rights?.[area]?.[level];
  };
  console.log('🔐 Benutzer:', user);


  return (
    <div>
      <nav className="navbar">
        <div className="navbar-brand">FinanzApp</div>
        <ul className="navbar-links">
          {user && (
            <>
              <li className={location.pathname === '/' ? 'active' : ''}>
                <Link to="/">Dashboard</Link>
              </li>

              {hasRight('transactions', 'read') && (
                <>
                  <li className={location.pathname === '/income' ? 'active' : ''}>
                    <Link to="/income">Einnahmen</Link>
                  </li>
                  <li className={location.pathname === '/expense' ? 'active' : ''}>
                    <Link to="/expense">Ausgaben</Link>
                  </li>
                </>
              )}

              {hasRight('events', 'read') && (
                <li className={location.pathname === '/events' ? 'active' : ''}>
                  <Link to="/events">Events/Kalender</Link>
                </li>
              )}

              {hasRight('users', 'read') && (
                <li className={location.pathname === '/admin' ? 'active' : ''}>
                  <Link to="/admin">Benutzer</Link>
                </li>
              )}
            </>
          )}
        </ul>

        {user ? (
          <div className="user-section">
            <span>👋 {user.email ?? user.username}</span>
            <button onClick={logout}>Logout</button>
          </div>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </nav>

      <main className="main-content">{children}</main>
    </div>
  );
};

export default Layout;
