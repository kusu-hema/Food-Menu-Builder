import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = ({ setIsLoggedIn }) => {
  const navigate = useNavigate();

  useEffect(() => {
    localStorage.clear();
    setIsLoggedIn(false); // 🔐 Important: log user out in app state

    setTimeout(() => {
      navigate('/'); // ✅ Redirect to login (which is '/')
    }, 1500);
  }, [navigate, setIsLoggedIn]);

  return (
    <div className="logout-container">
      <div className="logout-box">
        <h2>Logging out...</h2>
        <p>You are being redirected to the login page.</p>
      </div>
    </div>
  );
};

export default Logout;
