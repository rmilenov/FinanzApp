import React, { createContext } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import { AuthContext, useAuth } from "./components/Auth";
import Layout from "./components/Layout";
import Home from "./pages/Home";
import Income from "./pages/Income";
import Expense from "./pages/Expense";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import Events from "./pages/Events";

const AppRoutes = () => {
  const { user } = useAuth();

  if (!user) {
    return (
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="*" element={<Navigate to="/login" />} />
        <Route path="/register" element={<RegisterPage />} />
      </Routes>
    );
  }

  return (
    <Layout>
      <Routes>
        <Route
          path="/income"
          element={
            user?.rights?.transactions?.read ? <Income /> : <Navigate to="/" />
          }
        />
        <Route
          path="/expense"
          element={
            user?.rights?.transactions?.read ? <Expense /> : <Navigate to="/" />
          }
        />
        <Route
          path="/events"
          element={
            user?.rights?.events?.read ? <Events /> : <Navigate to="/" />
          }
        />
        
        {/* <Route
          path="/admin"
          element={
            user?.rights?.users?.read ? <AdminPage /> : <Navigate to="/" />
          }
        /> */}
      </Routes>
    </Layout>
  );
};

export default AppRoutes;
