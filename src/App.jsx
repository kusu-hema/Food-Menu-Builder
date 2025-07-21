import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import Sidebar from './Components/Sidebar';
import AppRoutes from './routes/AppRoutes';
import Footer from './Components/Footer'; // ✅ Footer component
import './App.css';

// ⏬ Layout with Sidebar + Content + Footer
const AppLayout = ({ isLoggedIn, setIsLoggedIn }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      
      <div style={{ display: 'flex', flex: 1 }}>
        {/* Sidebar (only when logged in and not on login page) */}
        {!isLoginPage && isLoggedIn && <Sidebar />}

        {/* Main content area */}
        <div style={{ flex: 1, padding: '20px', backgroundColor: '#f4f6f8' }}>
          <AppRoutes isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        </div>
      </div>

      {/* ✅ Footer at bottom (hidden on login page) */}
      {!isLoginPage && <Footer />}
    </div>
  );
};

// ⏬ Main App wrapper
function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(() => {
    return localStorage.getItem('isLoggedIn') === 'true';
  });

  useEffect(() => {
    localStorage.setItem('isLoggedIn', isLoggedIn);
  }, [isLoggedIn]);

  return (
    <Router>
      <AppLayout isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
    </Router>
  );
}

export default App;
