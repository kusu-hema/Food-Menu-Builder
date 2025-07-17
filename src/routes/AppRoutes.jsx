import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from '../pages/Dashboard';
import Login from '../pages/Login';

const AppRoutes = ({ isLoggedIn, setIsLoggedIn }) => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          isLoggedIn
            ? <Navigate to="/dashboard" />
            : <Login onLogin={() => setIsLoggedIn(true)} />
        }
      />
      <Route
        path="/dashboard"
        element={
          isLoggedIn
            ? <Dashboard />
            : <Navigate to="/" />
        }
      />
    </Routes>
  );
};

export default AppRoutes;
