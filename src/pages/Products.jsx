import React, { useState, useEffect } from 'react';

// Main App component
const Products = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // useEffect hook to fetch data when the component mounts
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        // Fetch data from your backend API
        const response = await fetch('http://localhost:4000/api/categories');
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data = await response.json();
        setCategories(data);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching categories:", err);
        setError('Failed to fetch data. Please ensure your backend is running.');
        setLoading(false);
      }
    };

    fetchCategories();
  }, []);

  // Render the table based on the state
  return (
    <div className="bg-gray-100 min-h-screen p-8 font-sans antialiased">
      <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-lg p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">
          Categories Table
        </h1>

        {/* Conditional rendering based on loading, error, and data state */}
        {loading && (
          <div className="flex justify-center items-center h-48">
            <div className="text-xl text-gray-600">Loading...</div>
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold">Error!</strong>
            <span className="block sm:inline ml-2">{error}</span>
          </div>
        )}

        {!loading && !error && categories.length > 0 && (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    SNo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {categories.map((category) => (
                  <tr key={category.sno}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {category.sno}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {/* <img
                        src={`http://localhost:4000/${category.image}`} // Construct the URL to the image
                        alt={category.category_name}
                        className="h-12 w-12 rounded-full object-cover"
                        onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/48x48?text=N/A"; }}
                      /> */}
                       <img
                        src={`http://localhost:4000/${category.image}`}
                        alt={category.category_name}
                        className="h-12 w-12 rounded-full object-cover"
                        onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/48x48?text=N/A"; }}
                      />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                      {category.category_name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                      {category.status}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {!loading && !error && categories.length === 0 && (
          <div className="flex justify-center items-center h-48">
            <div className="text-xl text-gray-600">No categories found.</div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Products;
