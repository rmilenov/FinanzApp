// src/pages/LoginPage.js
import React from 'react';
import LoginForm from '../components/LoginForm';
import { Link } from 'react-router-dom';

const LoginPage = () => 
<div>
<LoginForm />;
<p>Noch keinen Account? <Link to="/register">Jetzt registrieren</Link></p>
</div>

export default LoginPage;
