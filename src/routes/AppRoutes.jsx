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
import  Packages from '../pages/Packages';

//  Login page 
import Login from '../pages/Login';

const AppRoutes = ({ isLoggedIn, setIsLoggedIn }) => {
  if (!isLoggedIn) {
    return (
      <Routes>
        <Route path="/" element={<Login onLogin={() => setIsLoggedIn(true)} />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    );
  }

  return (
    <Routes>
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/leads" element={<Leads />} />
      <Route path="/customers" element={<Customers />} />
      <Route path="/orders" element={<Orders />} />
      <Route path="/Categories" element={<Categories />} />
      <Route path="/products" element={<Products />} />
      <Route path="/invoice" element={<Invoice />} />
      <Route path="/events" element={<CorporateEvents />} />
      <Route path="/packages" element={<Packages />} />

      {/* Add other pages here like /orders, /products etc */}
      <Route path="*" element={<Navigate to="/dashboard" />} />
    </Routes>
  );
};

export default AppRoutes;
