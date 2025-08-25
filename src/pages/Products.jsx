import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

/**
 * Renders the form to create or edit a product.
 * It uses a callback function to notify the parent component (App)
 * when a new product has been successfully created or updated,
 * allowing the parent to refresh the data in the table.
 *
 * @param {object} props - The component props.
 * @param {object} props.editingProduct - The product object to edit, or null for a new product.
 * @param {function} props.onProductSaved - A callback function to call after a successful save (create/update).
 * @param {function} props.onClose - A callback to close the modal.
 */
const ProductForm = ({ editingProduct, onProductSaved, onClose }) => {
  const [product, setProduct] = useState(''); // Updated state variable name to match backend
  const [category, setCategory] = useState('');
  const [action, setAction] = useState('');
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState(null);

  // Use a useEffect hook to populate the form fields when a product is selected for editing
  useEffect(() => {
    if (editingProduct) {
      // Use the correct product key here
      setProduct(editingProduct.product); 
      setCategory(editingProduct.category);
      setAction(editingProduct.action);
    } else {
      // Clear form for new product creation
      setProduct('');
      setCategory('');
      setAction('');
      setImage(null);
    }
  }, [editingProduct]); // This effect runs whenever editingProduct changes

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null); // Reset message on new submission

    // Create a FormData object to handle file and text data
    const formData = new FormData();
    // Only append a new image if one has been selected
    if (image) {
      formData.append('image', image);
    }
    // Updated to use the correct key name 'product'
    formData.append('product', product); 
    formData.append('category', category);
    formData.append('action', action);

    // Determine the API endpoint and HTTP method based on whether we are editing or creating
    const isEditing = !!editingProduct;
    const url = isEditing
      ? `http://localhost:4000/api/products/${editingProduct.sno}`
      : 'http://localhost:4000/api/products';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        body: formData,
      });

      if (response.ok) {
        const successMessage = isEditing
          ? 'Product updated successfully!'
          : 'Product created successfully!';
        setMessage({ text: successMessage, type: 'success' });

        // Call the callback to trigger a refresh in the table component
        onProductSaved();
        // Close the modal after a short delay
        setTimeout(onClose, 1000);
      } else {
        const errorData = await response.json();
        setMessage({ text: `Error: ${errorData.message}`, type: 'error' });
      }
    } catch (error) {
      console.error(`Error saving product:`, error);
      setMessage({ text: 'Failed to connect to the server.', type: 'error' });
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm">
      <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
        {editingProduct ? 'Edit Product' : 'Add New Product'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="product" className="block text-sm font-medium text-gray-700">Product</label>
          <input
            type="text"
            id="product"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category Name</label>
          <input
            type="text"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="action" className="block text-sm font-medium text-gray-700">Action</label>
          <input
            type="text"
            id="action"
            value={action}
            onChange={(e) => setAction(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image</label>
          {/* Display current image when in editing mode */}
          {editingProduct && editingProduct.image && (
            <div className="mt-2 mb-4">
              <span className="block text-xs text-gray-500 mb-1">Current Image:</span>
              <img
                src={`http://localhost:4000/${editingProduct.image}`}
                alt="Current product"
                className="h-24 w-24 rounded-full object-cover"
              />
            </div>
          )}
          <input
            type="file"
            id="image"
            name="image"
            onChange={(e) => setImage(e.target.files[0])}
            className="mt-1 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 cursor-pointer"
          />
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
        >
          {editingProduct ? 'Save Changes' : 'Add Product'}
        </button>
      </form>

      {/* Message Box */}
      {message && (
        <div className={`mt-4 px-4 py-3 rounded-lg text-center font-medium ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message.text}
        </div>
      )}
    </div>
  );
};

// Modal component to wrap the form
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
      <div className="relative p-6 rounded-lg shadow-xl animate-fade-in-up">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-800 transition-colors duration-200">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
        {children}
      </div>
    </div>
  );
};

/**
 * Renders the table of products with edit and delete buttons.
 *
 * @param {object} props - The component props.
 * @param {Array<object>} props.products - The list of products to display.
 * @param {boolean} props.loading - Loading state.
 * @param {string} props.error - Error message.
 * @param {function} props.onEdit - Callback for editing a product.
 * @param {function} props.onDelete - Callback for deleting a product.
 */
const ProductsTable = ({ products, loading, error, onEdit, onDelete }) => {
  return (
    <div className="rounded-lg p-6 w-full max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Product Table</h1>
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
      {!loading && !error && products.length > 0 && (
        // The table is now hidden on small screens and a card layout is shown instead.
        // It becomes a standard table again on medium-sized screens and up.
        <>
          {/* Table view for medium and larger screens */}
          <div className="hidden md:block">
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
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Category Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.sno}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {product.sno}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.image && (
                        <img
                          src={`http://localhost:4000/${product.image}`}
                          alt={product.product}
                          className="h-12 w-12 rounded-full object-cover"
                          onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/48x48?text=N/A"; }}
                        />
                      )}
                      {!product.image && (
                        <img
                          src="https://placehold.co/48x48?text=N/A"
                          alt="Not available"
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                      {/* Using product.product to match the backend key */}
                      {product.product} 
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                      {product.action}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => onEdit(product)}
                        className="px-4 py-2 mr-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(product.sno)}
                        className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Card view for small screens */}
          <div className="md:hidden space-y-4">
            {products.map((product) => (
              <div key={product.sno} className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                <div className="flex items-center space-x-4 mb-4">
                  {product.image && (
                    <img
                      src={`http://localhost:4000/${product.image}`}
                      alt={product.product}
                      className="h-16 w-16 rounded-full object-cover"
                      onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/64x64?text=N/A"; }}
                    />
                  )}
                  {!product.image && (
                    <img
                      src="https://placehold.co/64x64?text=N/A"
                      alt="Not available"
                      className="h-16 w-16 rounded-full object-cover"
                    />

                  )}
                  <div className="flex-1">
                    <div className="font-bold text-gray-900 text-lg capitalize">{product.product}</div>
                    <div className="text-gray-500 text-sm">SNo: {product.sno}</div>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div><span className="font-semibold text-gray-800">Category Name:</span> <span className="capitalize">{product.category}</span></div>
                  <div><span className="font-semibold text-gray-800">Action:</span> <span className="capitalize">{product.action}</span></div>
                </div>
                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => onEdit(product)}
                    className="flex-1 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(product.sno)}
                    className="flex-1 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
      {!loading && !error && products.length === 0 && (
        <div className="flex justify-center items-center h-48">
          <div className="text-xl text-gray-600">No products found.</div>
        </div>
      )}
    </div>
  );
};

// This is the main parent component that orchestrates the layout
const  Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [message, setMessage] = useState(null);

  // Function to fetch the products from the backend
  const fetchProducts = async () => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:4000/api/products');
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      setProducts(data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching products:", err);
      setError('Failed to fetch data. Please ensure your backend is running.');
      setLoading(false);
    }
  };

  // Function to handle product deletion
  const handleDelete = async (sno) => {
    try {
      const response = await fetch(`http://localhost:4000/api/products/${sno}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete product.');
      }
      // If deletion is successful, refresh the list
      fetchProducts();
    } catch (err) {
      console.error("Error deleting product:", err);
      setError('Failed to delete product. Please try again.');
    }
  };

  // Function to handle the edit button click
  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };
  
  // Function to close the modal and reset the editing state
  const closeModalAndReset = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

  // Function to handle Excel file import
  const handleImport = (event) => {
    setMessage(null);
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 }); // Use header: 1 to get array of arrays

          if (!Array.isArray(json) || json.length < 2) {
            setMessage({ text: 'No data found in the Excel file.', type: 'error' });
            return;
          }

          // Normalize keys to match the database schema
          const headers = json[0].map(header => header.toLowerCase().replace(/\s/g, ''));
          const productData = json.slice(1).map(row => {
            const productObject = {};
            headers.forEach((header, index) => {
              // Map Excel header names to the correct keys
              if (header === 'sno') productObject.sno = row[index];
              if (header === 'product' || header === 'productname') productObject.product = row[index];
              if (header === 'category' || header === 'categoryname') productObject.category = row[index];
              if (header === 'action') productObject.action = row[index];
            });
            return productObject;
          });

          const response = await fetch('http://localhost:4000/api/products/bulk-import', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(productData),
          });

          if (response.ok) {
            setMessage({ text: 'Products imported successfully!', type: 'success' });
            fetchProducts();
          } else {
            const errorData = await response.json();
            setMessage({ text: `Error: ${errorData.message}`, type: 'error' });
          }
        } catch (error) {
          console.error("Error importing products:", error);
          setMessage({ text: 'Failed to import file. Please check the file format.', type: 'error' });
        }
      };
      reader.readAsArrayBuffer(file);
    }
  };

  // Function to handle Excel file export
  const handleExport = () => {
    if (products.length === 0) {
      setMessage({ text: 'No products to export.', type: 'error' });
      return;
    }
    const worksheet = XLSX.utils.json_to_sheet(products);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Products");
    XLSX.writeFile(workbook, "products.xlsx");
  };

  // Fetch data when the component mounts or after a save/delete
  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen p-8 font-sans antialiased">
      <div className="flex flex-col md:flex-row md:justify-center md:items-start space-y-8 md:space-y-0 md:space-x-8">
        {/* Container for the table and the buttons */}
        <div className="w-full max-w-2xl">
          <div className="flex flex-col sm:flex-row justify-between items-center mb-4 space-y-2 sm:space-y-0 sm:space-x-4">
            <button
              onClick={() => {
                setEditingProduct(null); // Ensure form is for creation
                setIsModalOpen(true);
              }}
              className="w-full sm:w-auto flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              Add New Product
            </button>
            <button
              onClick={handleExport}
              className="w-full sm:w-auto flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-colors"
            >
              Export to Excel
            </button>
            <label
              htmlFor="excel-import"
              className="w-full sm:w-auto flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-colors cursor-pointer"
            >
              Import from Excel
              <input
                id="excel-import"
                type="file"
                accept=".xlsx, .xls"
                onChange={handleImport}
                className="hidden"
              />
            </label>
          </div>
          {message && (
            <div className={`mt-4 px-4 py-3 rounded-lg text-center font-medium ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {message.text}
            </div>
          )}
          <ProductsTable
            products={products}
            loading={loading}
            error={error}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />
        </div>
      </div>
      
      {/* The Modal component is now conditionally rendered */}
      <Modal isOpen={isModalOpen} onClose={closeModalAndReset}>
        <ProductForm
          editingProduct={editingProduct}
          onProductSaved={fetchProducts}
          onClose={closeModalAndReset}
        />
      </Modal>
    </div>
  );
};

export default Products;