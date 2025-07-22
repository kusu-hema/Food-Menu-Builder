import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import Sidebar from './Components/Sidebar';
import AppRoutes from './routes/AppRoutes';
import './App.css';

const AppLayout = ({ isLoggedIn, setIsLoggedIn }) => {
  const location = useLocation();
  const isLoginPage = location.pathname === '/';

  // Sidebar toggle state lifted to AppLayout
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const toggleSidebar = () => setIsSidebarOpen(prev => !prev);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      
      <div style={{ display: 'flex', flex: 1 }}>
        {/* Sidebar (only when logged in and not on login page) */}
        {!isLoginPage && isLoggedIn && (
          <div style={{ width: isSidebarOpen ? '20%' : '0%', transition: 'width 0.3s ease' }}>
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
          </div>
        )}

        {/* Main content area */}
        <div
          style={{
            flex: 1,
            width: isSidebarOpen ? '80%' : '100%',
            transition: 'width 0.3s ease',
            backgroundColor: '#f4f6f8',
            padding: '20px',
            overflowX: 'auto'
          }}
        >
          <AppRoutes isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
        </div>
      </div>
    </div>
  );
};

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
