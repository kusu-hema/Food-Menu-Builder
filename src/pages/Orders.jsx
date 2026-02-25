import React, { useState } from 'react';

const orders = () => {
  const [mobileNumber, setMobileNumber] = useState('');
  const [message, setMessage] = useState('');

  // regex 
  const handleInputChange = (event) => {
    const value = event.target.value;

    if (/^\d*$/.test(value)) {
      setMobileNumber(value);

      // Regular expression to match exactly 10 digits
      const regex = /^\d{10}$/;
      if (value.length === 0 || regex.test(value)) {
        setMessage(value.length === 10 ? 'Mobile number is valid.' : '');
      } else {
        setMessage('Mobile number must be exactly 10 digits.');
      }
    } else {
      setMessage('Only digits are allowed.');
    }
  };

  return (
    <div>
      <h1>Mobile Number Validation</h1>
      <input
        type="text"
        value={mobileNumber}
        onChange={handleInputChange}
        placeholder="Enter your mobile number"
      />
      {message && (
        <p style={{ color: message === 'Mobile number is valid.' ? 'green' : 'red' }}>
          {message}
        </p>
      )}
    </div>
  );
};

export default orders;