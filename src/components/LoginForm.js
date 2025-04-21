// src/components/LoginForm.js
import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginForm = () => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = () => {
    const user = JSON.parse(localStorage.getItem(`user_${email}`));
    if (user && user.password === password) {
      login(user);
      navigate('/');
    } else {
      alert('Ungültige Anmeldedaten');
    }
  };

  return (
    <div>
      <h2>Login</h2>
      <input placeholder="E-Mail" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="Passwort" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleLogin}>Einloggen</button>
    </div>
  );
};

export default LoginForm;
