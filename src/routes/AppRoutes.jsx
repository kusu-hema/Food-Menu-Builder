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
import EditMenu from '../pages/EditMenu';

// Menu Edit Folder.....    
import Items from '../MenuEdit/Items';
import Menu from '../MenuEdit/Menu';
import Preview from '../MenuEdit/Preview';
import Selector from '../MenuEdit/Selector';


// Logout&Footer page.....      
import Logout from '../pages/Logout';
import Footer from '../Components/Footer'

// Login page.....                                                                                                                                                                                                                                                                                                                
import Login from '../pages/Login';
import DisplayMenu from '../Menus/DisplayMenu';




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
          {/* pages  */}
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/leads" element={<Leads />} />
          <Route path="/customers" element={<Customers />} />
          <Route path="/customerprofile" element={<CustomerProfile />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/categories" element={<Categories />} />
          <Route path="/products" element={<Products />} />
          <Route path="/packages" element={<Packages />} />
          <Route path="/invoice" element={<Invoice />} />
          <Route path="/events" element={<CorporateEvents />} />
          <Route path="/editmenu" element={<EditMenu />} />


          {/* Menu Edit Folder */}
          <Route path="/items" element={<Items />} />
          <Route path="/menu" element={<Menu />} />
          <Route path="/preview" element={<Preview />} />
          <Route path="/items" element={<Selector />} />

          <Route path="/displaymenu/:id" element={<DisplayMenu />} />



          {/* Total menu  */}
          <Route path="/totalmenu" element={<TotalMenu />} />

          {/* Footer and Logout */}
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
