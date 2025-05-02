// src/components/LoginForm.js
import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Spinner from './Spinner';
import '../style/login.css';

const LoginForm = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
  
      const data = await res.json(); // ✅ nur einmal
  
      if (!res.ok) {
        throw new Error(data.error || 'Login fehlgeschlagen');
      }
      console.log('🔐 Token empfangen:', data.token);
      login({ token: data.token,onLogin:()=>{
        navigate('/');
        console.log("Login erfolgreich");
      } }); // ✅ nur Token übergeben
     
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-logo">FinanzApp💰</div>
        
        <h2>Willkommen zurück!</h2>
        <p>Bitte melde dich mit deinen Zugangsdaten an.</p>

        <input
          type="text"
          placeholder="Benutzername oder E-Mail"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
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
