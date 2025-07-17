import React, { useState } from 'react';
import { BrowserRouter as Router, useLocation } from 'react-router-dom';
import Sidebar from './Components/Sidebar';
import AppRoutes from './routes/AppRoutes';

const Layout = ({ isLoggedIn, setIsLoggedIn }) => {
  const location = useLocation();

  // Hide Sidebar on login page
  const isLoginPage = location.pathname === '/';
  const showSidebar = isLoggedIn && !isLoginPage;

  return (
    <div style={{ display: 'flex' }}>
      {showSidebar && <Sidebar />}
      <div style={{ flex: 1, padding: '20px', backgroundColor: '#f4f6f8', minHeight: '100vh' }}>
        <AppRoutes isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
      </div>
    </div>
  );
};

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  return (
    <Router>
      <Layout isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
    </Router>
  );
}

export default App;
