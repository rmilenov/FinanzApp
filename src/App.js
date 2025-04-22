import React, { createContext } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthContext, useAuth } from './components/Auth';
import Layout from './components/Layout';
import Home from './pages/Home';
import Income from './pages/Income';
import Expense from './pages/Expense';

import LoginPage from './pages/LoginPage';
import Events from './pages/Events';

const AppRoutes = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" />} />
      </Routes>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/income" element={<Income />} />
        <Route path="/expense" element={<Expense />} />
        <Route path="/Events" element={<Events />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Layout>
  );
};

export default AppRoutes;
