import React, { useState } from 'react';
import loginImage from '../assets/img/Group-5.webp';
import '../assets/css/style.css';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const validUsername = 'admin';
  const validPassword = '1234';

  const handleLogin = () => {
    if (username === validUsername && password === validPassword) {
      onLogin();
    } else {
      setError('Invalid username or password');
    }
  };

  return (
    <div className="login-container">
      
      {/* Left Column - Image */}
      <div
        className="login-image"
        style={{ backgroundImage: `url(${loginImage})` }}
      ></div>

      {/* Right Column - Form */}
      <div className="login-form-wrapper">
        <div className="login-form">
          <h2>Welcome Back</h2>

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
          />

          {error && (
            <p style={{ color: 'red', marginBottom: '10px', fontSize: '13px' }}>
              {error}
            </p>
          )}

          <button onClick={handleLogin}>Login</button>

          <p>
            Forgot Password?{' '}
            <span onClick={() => alert('Reset feature coming soon!')}>
              Reset
            </span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
