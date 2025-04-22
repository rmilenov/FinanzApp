// src/components/LoginForm.js
import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Spinner from '../components/Spinner';

import "../style/login.css"

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    const user = JSON.parse(localStorage.getItem(`user_${email}`));
    setTimeout(() => {
    if (user && user.password === password) {
      login(user);
      navigate('/');
    } else {
      alert('Ungültige Anmeldedaten');
    }
        setLoading(false);
    }, 1000); 
  };

  return (
    <div className="login-container">
      <div className="login-box">
      <div className="login-logo">FinanzApp💰</div>
        
        <h2>Willkommen zurück!</h2>
        <p>Bitte melde dich mit deinen Zugangsdaten an.</p>
        <input
          type="text"
          placeholder="Benutzername"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Passwort"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button type="submit" disabled={loading} onClick={handleLogin}>
                {loading ? <Spinner /> : 'Login'}
        </button>
        <div className="forgot-password">
            <a href="#">Passwort vergessen?</a>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;
