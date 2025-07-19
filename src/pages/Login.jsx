import React, { useState } from 'react';

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
      maxWidth: '400px', margin: '100px auto', padding: '30px',
      background: '#fff', borderRadius: '10px', boxShadow: '0 0 10px rgba(0,0,0,0.1)'
    }}>
      <h2 style={{ marginBottom: '20px' }}>Login</h2>
      <input
        type="text"
        placeholder="Username"
        value={username}
        onChange={e => setUsername(e.target.value)}
        style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={e => setPassword(e.target.value)}
        style={{ width: '100%', padding: '10px', marginBottom: '10px' }}
      />
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <button
        onClick={handleLogin}
        style={{
          width: '100%', padding: '10px', background: '#5b28f0',
          color: 'white', border: 'none', borderRadius: '5px'
        }}
      >
        Login
      </button>

      {/* <div style={{ marginTop: '20px', fontSize: '14px', color: '#6b7280' }}>
        <strong>Sample Credentials:</strong><br />
        Username: <code>admin</code><br />
        Password: <code>1234</code>
      </div> */}


    </div>
  );
};

export default Login;
