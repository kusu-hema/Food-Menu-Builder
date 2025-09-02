import React, { useState, useEffect } from 'react';

function MenuItems({ onAdd, selectedItems }) {
  const [items, setItems] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const apiUrl = 'http://localhost:4000/api/products';

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        setItems(data);
        setIsLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <div>Loading menu items...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  const imageBaseUrl = 'http://localhost:4000/';

  return (
    <div>
      <h3 className="text-lg font-semibold mb-4">Available Items</h3>
      <div className="grid grid-cols-3 gap-4">
        {items.map((item) => (
          <div
            key={item.product}
            onClick={() => {
              if (typeof onAdd === 'function') {
                onAdd(item.product); // Pass unique ID
              } else {
                console.error("Error: 'onAdd' prop is not a function.");
              }
            }}
            style={{
              border: '1px solid #ccc',
              padding: '10px',
              cursor: 'pointer',
              background: selectedItems.includes(item.product) ? '#e0ffe0' : '#fff',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              textAlign: 'center',
              borderRadius: '8px'
            }}
          >
            {item.image && (
              <img
                src={`${imageBaseUrl}${item.image}`}
                alt={item.product}
                style={{
                  width: '50px',
                  height: '50px',
                  marginBottom: '10px',
                  borderRadius: '50%',
                  objectFit: 'cover'
                }}
              />
            )}
            {/* <span>➕ {item.product}</span> */}
            <span style={{ fontSize: '12px' }}> {item.product}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default MenuItems;