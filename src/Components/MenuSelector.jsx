import React, { useState, useEffect } from 'react';

function MenuSelector({ selected, onSelect }) {
  const [categories, setCategories] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Replace with your actual localhost URL
    const apiUrl = 'http://localhost:4000/api/categories'; 

    fetch(apiUrl)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => {
        // Assuming the API returns an array of objects with a 'category_name' field
        const fetchedCategories = data.map(item => item.category_name);
        setCategories(fetchedCategories);
        setIsLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setIsLoading(false);
      });
  }, []);

  if (isLoading) {
    return <div>Loading categories...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Select Menu Category</h2>
      {categories.map((cat) => (
        <button
          key={cat}
          onClick={() => onSelect(cat)}
          style={{
            margin: '5px',
            padding: '10px',
            background: selected === cat ? 'darkblue' : 'lightgray',
            color: selected === cat ? 'white' : 'black'
          }}
        >
          {cat}
        </button>
      ))}
    </div>
  );
}

export default MenuSelector;