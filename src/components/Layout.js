// src/components/Layout.js
import React from 'react';
import { Link,useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { useAuth } from './Auth';
import '../index.css';


const Layout = ({ children }) => {
  const { user, logout } = useAuth();
  const location = useLocation();

  return (
    <div>
      <nav className="navbar">
        <div className="navbar-brand">FinanzApp</div>
        <ul className='navbar-links'>
          {user && (
            <>
              <li className={location.pathname === '/' ? 'active' : ''}>
            <Link to="/">Dashboard</Link>
          </li>
          <li className={location.pathname === '/income' ? 'active' : ''}>
            <Link to="/income">Einnahmen</Link>
          </li>
          <li className={location.pathname === '/expense' ? 'active' : ''}>
            <Link to="/expense">Ausgaben</Link>
          </li>
          <li className={location.pathname === '/events' ? 'active' : ''}>
            <Link to="/events">Events/Kalender</Link>
          </li>
            </>
          )}
        </ul>
        {user ? (
          <div className="user-section">
            <span>👋 {user.email}</span>
            <button onClick={logout}>Logout</button>
          </div>
        ) : (
          <Link to="/login">Login</Link>
        )}
      </nav>
      <main className='main-content'>{children}</main>
    </div>
  );
};

export default Layout;
