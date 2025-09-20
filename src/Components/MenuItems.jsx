import React, { useState, useEffect } from 'react';

function MenuItems({ selectedItems, onAddItem }) {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [items, setItems] = useState([]);

  // useEffect(() => {
  //   fetch('http://localhost:4000/api/categories')
  //     .then(res => res.json())
  //     .then(data => {
  //       const categoryList = data.map(item => item.category_name);
  //       setCategories(categoryList);
  //       setSelectedCategory(categoryList[0] || '');
  //     });
  // }, []);

  // Add a useEffect hook to fetch categories and set the sorted list
  useEffect(() => {
    fetch('http://localhost:4000/api/categories')
      .then(res => res.json())
      .then(data => {
        // Sort the data by the 'sno' property in ascending order
        const sortedData = data.sort((a, b) => a.sno - b.sno);
        const categoryList = sortedData.map(item => item.category_name);
        setCategories(categoryList);
        setSelectedCategory(categoryList[0] || '');
      })
      .catch(error => {
        console.error("Error fetching categories:", error);
        // Optional: Handle error state in the UI
      });
  }, []);

  useEffect(() => {
    fetch('http://localhost:4000/api/products')
      .then(res => res.json())
      .then(data => setItems(data));
  }, []);

  const filteredItems = items.filter(item =>
    item.category?.trim().toLowerCase() === selectedCategory.trim().toLowerCase()
  );

  return (
    <div>
      <div className="mb-4 flex flex-wrap gap-2 ">
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

      <h3 className="text-lg font-semibold mb-4">Available Items</h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
        {filteredItems.map((item) => (
          <div
            key={item.product}
            // onClick={() => onAddItem(item.category, item.product)}
            onClick={() => onAddItem(selectedCategory, item.product)}
            className={`border rounded-lg p-3 cursor-pointer flex flex-col items-center text-center transition ${
              selectedItems[selectedCategory]?.includes(item.product) ?
               'bg-green-100' : 'bg-white'
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

export default MenuItems;