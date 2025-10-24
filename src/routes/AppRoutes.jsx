import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
    
// pages......
import Dashboard from '../pages/Dashboard';
import Leads from '../pages/Leads';
import Customers from '../pages/Customers';
import CustomerProfile from '../pages/CustomerProfile';

import Orders from '../pages/Orders';
import Categories from '../pages/Categories';
import Products from '../pages/Products';                                                                                                         
import Invoice from '../pages/Invoice';
import CorporateEvents from '../pages/CorporateEvents';
import Packages from '../pages/Packages';
import TotalMenu from '../pages/TotalMenus';


import Items from '../MenuEdit/Items';
import EditMenu from '../pages/EditMenu';
import Preview from '../MenuEdit/Preview';
import MenuSelector from '../Components/MenuSelector';



import Logout from '../pages/Logout';
import Footer from '../Components/Footer'

// Login page.....                                                                                                                                                                                                                                                                                                                
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
          <Route path="/customerprofile" element={<CustomerProfile />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/products" element={<Products />} />
          <Route path="/invoice" element={<Invoice />} />
          <Route path="/events" element={<CorporateEvents />} />
          <Route path="/editmenu" element={<EditMenu />} />



          <Route path="/items" element={<Items />} />
          <Route path="/items" element={<Menu />} />
          <Route path="/items" element={<Preview />} />
          <Route path="/items" element={<MenuSelector />} />



          <Route path="/packages" element={<Packages />} />
          <Route path="/totalmenu" element={<TotalMenu />} />


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
