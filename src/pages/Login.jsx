import React, { useState } from 'react';
import loginImage from '../assets/Group-5.webp';

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
    <div style={{
      display: 'flex',
      height: '100vh',
      fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
    }}>
      
      {/* Left Image Section */}
      <div style={{
        flex: 1,
        // background: 'url(../assets/Group-5.webp) no-repeat center',
        background: `url(${loginImage}) no-repeat center`,

        backgroundSize: 'cover'
      }} />

      {/* Right Login Card */}
      <div style={{
        flex: 1,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f7f9fc',
        padding: '40px'
      }}>
        <div style={{
          width: '100%',
          maxWidth: '400px',
          padding: '40px',
          borderRadius: '15px',
          backgroundColor: '#ffffff',
          boxShadow: '0 8px 30px rgba(0,0,0,0.1)'
        }}>
          <h2 style={{
            marginBottom: '30px',
            textAlign: 'center',
            color: '#333',
            fontSize: '28px'
          }}>Welcome Back</h2>

          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={e => setUsername(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '15px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '14px'
            }}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            style={{
              width: '100%',
              padding: '12px',
              marginBottom: '15px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              fontSize: '14px'
            }}
          />

          {error && <p style={{ color: 'red', marginBottom: '10px', fontSize: '13px' }}>{error}</p>}

          <button
            onClick={handleLogin}
            style={{
              width: '100%',
              padding: '12px',
              background: '#5b28f0',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              fontSize: '15px',
              cursor: 'pointer'
            }}
          >
            Login
          </button>

          <p style={{
            marginTop: '20px',
            textAlign: 'center',
            fontSize: '13px',
            color: '#777'
          }}>
            Forgot Password? <span style={{ color: '#5b28f0', cursor: 'pointer' }}>Reset</span>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
