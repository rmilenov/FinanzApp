import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import '../style/login.css';

const RegisterForm = () => {
  const [form, setForm] = useState({ username: '', email: '', password: '', accessKey: '' });
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleRegister = async () => {
    setLoading(true);
    setError('');
    setMessage('');
    try {
      const res = await fetch('http://localhost:5000/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        let errMsg = 'Registrierung fehlgeschlagen';
        try {
          const errData = await res.json();
          errMsg = errData.error || errMsg;
        } catch (_) {
         
        }
        throw new Error(errMsg);
      }

      setMessage('Registrierung erfolgreich! Du wirst weitergeleitet ...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-logo">FinanzApp💰</div>

        <h2>Registrieren</h2>
        <p>Erstelle einen neuen Account mit Zugangsschlüssel.</p>

        <input
          name="username"
          placeholder="Benutzername"
          value={form.username}
          onChange={handleChange}
        />
        <input
          name="email"
          placeholder="E-Mail"
          value={form.email}
          onChange={handleChange}
        />
        <input
          name="password"
          type="password"
          placeholder="Passwort"
          value={form.password}
          onChange={handleChange}
        />
        <input
          name="accessKey"
          placeholder="Registrierungsschlüssel"
          value={form.accessKey}
          onChange={handleChange}
        />

        <button onClick={handleRegister} disabled={loading}>
          {loading ? 'Bitte warten...' : 'Registrieren'}
        </button>

        {error && <p className="error-message">{error}</p>}
        {message && <p className="success-message">{message}</p>}

        <div className="forgot-password">
          <Link to="/login">Zurück zum Login</Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterForm;
