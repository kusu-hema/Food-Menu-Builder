import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

// pages...........
import Dashboard from '../pages/Dashboard';
import Leads from '../pages/Leads';
import Customers from '../pages/Customers';
import Orders from '../pages/Orders';
import Categories from '../pages/Categories';
import Products from '../pages/Products';
import Invoice from '../pages/Invoice';
import CorporateEvents from '../pages/CorporateEvents';
import Packages from '../pages/Packages';
import Logout from '../pages/Logout';
import Footer from '../Components/Footer'

// Login page
import Login from '../pages/Login';

const AppRoutes = ({ isLoggedIn, setIsLoggedIn }) => {
  return (
    <Routes>
      {/* Login Route */}
      <Route
        path="/"
        element={
          isLoggedIn ? (
            <Navigate to="/dashboard" />
          ) : (
            <Login onLogin={() => setIsLoggedIn(true)} />
          )
        }
      />

      {/* Protected Routes */}
      {isLoggedIn && (
        <>
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/products" element={<Products />} />
          <Route path="/invoice" element={<Invoice />} />
          <Route path="/events" element={<CorporateEvents />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/footer" element={<Footer />} />
          <Route path="/logout" element={<Logout setIsLoggedIn={setIsLoggedIn} />} />
        </>
      )}

      {/* Catch-all redirect */}
      <Route path="*" element={<Navigate to={isLoggedIn ? '/dashboard' : '/'} />} />
    </Routes>
  );
};

export default AppRoutes;
