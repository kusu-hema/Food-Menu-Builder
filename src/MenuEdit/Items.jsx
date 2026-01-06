import React, { useState, useEffect } from 'react';

function  Items({ selectedItems, onAddItem }) {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [items, setItems] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch categories
  useEffect(() => {
    // fetch('http://localhost:4000/api/categories')
    fetch('http://localhost:4000/api/maincategory')
      .then(res => res.json())
      .then(data => { 
        const sortedData = data.sort((a, b) => a.sno - b.sno);
        const categoryList = sortedData.map(item => item.category_name);
        setCategories(categoryList);
        setSelectedCategory(categoryList[0] || '');
      })     
      .catch(error => {
        console.error("Error fetching categories:", error);
      });
  }, []);

  // Fetch products
  useEffect(() => {
    fetch('http://localhost:4000/api/products')
      .then(res => res.json())
      .then(data => setItems(data));
  }, []);

  // Filter + Sort products alphabetically (A → Z) + search filter
  const filteredItems = items
    .filter(item =>
      item.category?.trim().toLowerCase() === selectedCategory.trim().toLowerCase()
    )
    .filter(item =>
      item.product.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .sort((a, b) => a.product.localeCompare(b.product));

  return (
    <div>
      {/* Category Buttons */}
      <div className="mb-4 flex flex-wrap gap-2">
        {categories.map((cat) => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            className={`px-4 py-2 rounded-md text-sm font-medium ${
              selectedCategory === cat ? 'bg-blue-800 text-white' : 'bg-gray-200 text-black'
            } hover:bg-blue-600 hover:text-white transition`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Available Items */}
      <h3 className="text-lg font-semibold mb-2">Available Items</h3>

      {/*   Search Bar */}
      <input
        type="text"
        placeholder="Search products..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="w-full p-2 border rounded-md mb-4 focus:outline-none focus:ring focus:ring-blue-400"
      />

      {/* Items Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.product}
            onClick={() => onAddItem(selectedCategory, item.product)}
            className={`border rounded-lg p-3 cursor-pointer flex flex-col items-center text-center transition ${
              selectedItems[selectedCategory]?.includes(item.product)
                ? 'bg-green-100'
                : 'bg-white'
            } hover:shadow-md`}
          >
            {item.image && (
              <img
                src={`http://localhost:4000/${item.image}`}
                alt={item.product}
                className="w-12 h-12 mb-2 rounded-full object-cover"
              />
            )}
            <span className="text-xs font-medium truncate w-full">{item.product}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

export default  Items;