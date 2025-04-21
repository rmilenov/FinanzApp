// src/components/RegisterForm.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleRegister = () => {
    const user = { email, password };
    localStorage.setItem(`user_${email}`, JSON.stringify(user));
    navigate('/login');
  };

  return (
    <div>
      <h2>Registrieren</h2>
      <input placeholder="E-Mail" value={email} onChange={(e) => setEmail(e.target.value)} />
      <input placeholder="Passwort" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
      <button onClick={handleRegister}>Registrieren</button>
    </div>
  );
};

export default RegisterForm;
