import React, { useState, useEffect } from 'react';
import * as XLSX from 'xlsx';

// Helper function to get a value from local storage or return a default
const getFromLocalStorage = (key, defaultValue) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : defaultValue;
  } catch (error) {
    console.error(`Error retrieving ${key} from local storage`, error);
    return defaultValue;
  }
};

/**
 * Renders the form to create or edit a product with a better UI.
 *
 * @param {object} props - The component props.
 * @param {object} props.editingProduct - The product object to edit, or null for a new product.
 * @param {function} props.onProductSaved - A callback function to call after a successful save (create/update).
 * @param {function} props.onClose - A callback to close the modal.
 */
const ProductForm = ({ editingProduct, onProductSaved, onClose }) => {
  const [product, setProduct] = useState('');
  const [category, setCategory] = useState('');
  const [action, setAction] = useState('');
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState(null);
 
  useEffect(() => {
    if (editingProduct) {
      setProduct(editingProduct.product);
      setCategory(editingProduct.category);
      setAction(editingProduct.action);
    } else {
      setProduct('');
      setCategory('');
      setAction('');
      setImage(null);
    }
  }, [editingProduct]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);

    const formData = new FormData();
    if (image) {
      formData.append('image', image);
    }
    formData.append('product', product);
    formData.append('category', category);
    formData.append('action', action);

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
          ? 'Product updated successfully! 🎉'
          : 'Product created successfully! ✨';
        setMessage({ text: successMessage, type: 'success' });
        onProductSaved();
        setTimeout(onClose, 1500); // Increased delay for better user feedback
      } else {
        const errorData = await response.json();
        setMessage({ text: `Error: ${errorData.message}`, type: 'error' });
      }
    } catch (error) {
      console.error(`Error saving product:`, error);
      setMessage({ text: 'Failed to connect to the server. 😔', type: 'error' });
    }
  };

  return (
    // Add new product model 
    <div className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">
        {editingProduct ? 'Edit Product' : 'Add New Product'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="product" className="block text-sm font-semibold text-gray-700">Product Name</label>
          <input
            type="text"
            id="product"
            value={product}
            onChange={(e) => setProduct(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            required
          />
        </div>
        <div>
          <label htmlFor="category" className="block text-sm font-semibold text-gray-700">Category</label>
          <input
            type="text"
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
            required
          />
        </div>
        <div>
          {/* <label htmlFor="action" className="block text-sm font-semibold text-gray-700">Action</label> */}
          {/* <input
            type="text"
            id="action"
            value={action}
            onChange={(e) => setAction(e.target.value)}
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          /> */}
        </div>
        <div>
          <label htmlFor="image" className="block text-sm font-semibold text-gray-700">Image</label>
          {editingProduct && editingProduct.image && (
            <div className="mt-2 mb-4">
              <span className="block text-xs text-gray-500 mb-1">Current Image:</span>
              <img
                src={`http://localhost:4000/${editingProduct.image}`}
                alt="Current product"
                className="h-28 w-28 rounded-full object-cover border-2 border-gray-200"
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
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-base font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
        >
          {editingProduct ? 'Save Changes' : 'Add Product'}
        </button>
      </form>

      {message && (
        <div className={`mt-6 p-4 rounded-lg text-center font-medium ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
          {message.text}
        </div>
      )}
    </div>
  );
};

// Modal component with a nicer backdrop and animation
const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) {
    return null;
  }

  return (
    // Remove button for model popup
    <div className="fixed inset-0 bg-gray-900 bg-opacity-75 overflow-y-auto h-full w-full flex items-center justify-center z-50 animate-fade-in-backdrop">
      <div className="relative p-6 rounded-lg shadow-2xl transform transition-all duration-300 animate-fade-in-up">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-white rounded-full p-1">
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
 * Renders the table of products with edit and delete buttons with a better UI.
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
    <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-5xl mx-auto">
      <h1 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">Product Table</h1>

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
        <>
          {/* Table view for medium and larger screens */}
          <div className="hidden md:block overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    SNo
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Image
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Product
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Category Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-semibold text-gray-600 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {products.map((product) => (
                  <tr key={product.sno} className="hover:bg-gray-50 transition-colors duration-150">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {product.sno}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {product.image ? (
                        <img
                          src={`http://localhost:4000/${product.image}`}
                          alt={product.product}
                          className="h-12 w-12 rounded-full object-cover border"
                          onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/48x48?text=N/A"; }}
                        />
                      ) : (
                        <img
                          src="https://placehold.co/48x48?text=N/A"
                          alt="Not available"
                          className="h-12 w-12 rounded-full object-cover border"
                        />
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 capitalize">
                      {product.product}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 capitalize">
                      {product.category}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm space-x-2">
                      <button
                        onClick={() => onEdit(product)}
                        className="px-4 py-2 border border-transparent rounded-full shadow-sm text-xs font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(product.sno)}
                        className="px-4 py-2 border border-transparent rounded-full shadow-sm text-xs font-semibold text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
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
              <div key={product.sno} className="bg-white p-6 rounded-xl shadow-lg border border-gray-200">
                <div className="flex items-center space-x-4 mb-4">
                  {product.image ? (
                    <img
                      src={`http://localhost:4000/${product.image}`}
                      alt={product.product}
                      className="h-16 w-16 rounded-full object-cover border"
                      onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/64x64?text=N/A"; }}
                    />
                  ) : (
                    <img
                      src="https://placehold.co/64x64?text=N/A"
                      alt="Not available"
                      className="h-16 w-16 rounded-full object-cover border"
                    />
                  )}
                  <div className="flex-1">
                    <div className="font-bold text-gray-900 text-lg capitalize">{product.product}</div>
                    <div className="text-gray-500 text-sm">SNo: {product.sno}</div>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-gray-600">
                  <div><span className="font-semibold text-gray-800">Category:</span> <span className="capitalize">{product.category}</span></div>
                </div>
                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => onEdit(product)}
                    className="flex-1 py-2 px-4 border border-transparent rounded-full shadow-sm text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(product.sno)}
                    className="flex-1 py-2 px-4 border border-transparent rounded-full shadow-sm text-sm font-semibold text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
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
          <div className="text-xl text-gray-600">No products found. 😔</div>
        </div>
      )}
    </div>
  );
};

// ############################# Main parent component with a cleaner layout 
const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [message, setMessage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(10); // Or any other number you prefer

  // const fetchProducts = async () => {
  //   setLoading(true);
  //   try {
  //     const response = await fetch('http://localhost:4000/api/products');
  //     if (!response.ok) {
  //       throw new Error('Network response was not ok');
  //     }
  //     const data = await response.json();
  //     const sortedProducts = data.sort((a, b) => a.sno - b.sno);
  //     setProducts(sortedProducts);
  //     setLoading(false);
  //     // Reset to page 1 after fetching new data
  //     setCurrentPage(1); 
  //   } catch (err) {
  //     console.error("Error fetching products:", err);
  //     setError('Failed to fetch data. Please ensure your backend is running.');
  //     setLoading(false);
  //   }
  // };



  const fetchProducts = async (keepPage = false) => {
  setLoading(true);
  try {
    const response = await fetch('http://localhost:4000/api/products');
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    const data = await response.json();
    const sortedProducts = data.sort((a, b) => a.sno - b.sno);
    setProducts(sortedProducts);
    setLoading(false);

    //  Only reset to page 1 if not keeping the current page
    if (!keepPage) {
      setCurrentPage(1);
    }
  } catch (err) {
    console.error("Error fetching products:", err);
    setError('Failed to fetch data. Please ensure your backend is running.');
    setLoading(false);
  }
};


  const handleDelete = async (sno) => {
    try {
      // const response = await fetch(`http://localhost:4000/api/products/${sno}`, {
      //   method: 'DELETE',
      // });
      // if (!response.ok) {
      //   throw new Error('Failed to delete product.');
      // }
      // fetchProducts();
      await fetch(`http://localhost:4000/api/products/${sno}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete product.');
      fetchProducts(true); //  keep current page

    } catch (err) {
      console.error("Error deleting product:", err);
      setError('Failed to delete product. Please try again.');
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setIsModalOpen(true);
  };
 
  const closeModalAndReset = () => {
    setIsModalOpen(false);
    setEditingProduct(null);
  };

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
          const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

          if (!Array.isArray(json) || json.length < 2) {
            setMessage({ text: 'No data found in the Excel file.', type: 'error' });
            return;
          }

          const headers = json[0].map(header => header.toLowerCase().replace(/\s/g, ''));
          const productData = json.slice(1).map(row => {
            const productObject = {};
            headers.forEach((header, index) => {
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

          // if (response.ok) {
          //   setMessage({ text: 'Products imported successfully! ✨', type: 'success' });
          //   fetchProducts();
          if (response.ok) {
          setMessage({ text: 'Products imported successfully! ✨', type: 'success' });
          fetchProducts(true); // ✅ keep page after import
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
  
  // Exporting  & Importing the data in Excel sheet 
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

  useEffect(() => {
    fetchProducts();
  }, []);

  // Pagination Logic
  const totalPages = Math.ceil(products.length / productsPerPage);
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(indexOfFirstProduct, indexOfLastProduct);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Logic to generate a limited set of page numbers (e.g., 4)
  const getPageNumbers = () => {
    const pageNumbers = [];
    let startPage;
    const maxVisiblePages = 4;

    if (totalPages <= maxVisiblePages) {
      startPage = 1;
    } else if (currentPage <= Math.floor(maxVisiblePages / 2) + 1) {
      startPage = 1;
    } else if (currentPage + Math.floor(maxVisiblePages / 2) >= totalPages) {
      startPage = totalPages - maxVisiblePages + 1;
    } else {
      startPage = currentPage - Math.floor(maxVisiblePages / 2);
    }

    for (let i = 0; i < Math.min(totalPages, maxVisiblePages); i++) {
      pageNumbers.push(startPage + i);
    }

    return pageNumbers;
  };

  const pageNumbers = getPageNumbers();
  const showEllipsis = totalPages > 4 && currentPage + Math.floor(4 / 2) < totalPages;

  return (
    <div className="bg-gray-50 min-h-screen p-8 font-sans antialiased">
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row justify-center sm:justify-start items-center mb-6 space-y-4 sm:space-y-0 sm:space-x-4">

          {/* Add New Product button */}
          <button
            onClick={() => {
              setEditingProduct(null);
              setIsModalOpen(true);
            }}
            className="w-full sm:w-auto flex items-center justify-center py-3 px-6 border border-transparent rounded-full shadow-lg text-sm font-semibold text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-all transform hover:scale-105"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
            </svg>
            Add New Product
          </button>

           {/* Export to Excel button  */}
          <button
            onClick={handleExport}
            className="w-full sm:w-auto flex items-center justify-center py-3 px-6 border border-transparent rounded-full shadow-lg text-sm font-semibold text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all transform hover:scale-105"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm3.293-7.707a1 1 0 011.414 0L9 11.586V6a1 1 0 112 0v5.586l1.293-1.293a1 1 0 111.414 1.414l-3 3a1 1 0 01-1.414 0l-3-3a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
            Export to Excel
          </button>
  
         {/* Import from Excel button  */}
          <label
            htmlFor="excel-import"
            className="w-full sm:w-auto flex items-center justify-center py-3 px-6 border border-transparent rounded-full shadow-lg text-sm font-semibold text-white bg-orange-600 hover:bg-orange-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-orange-500 transition-all transform hover:scale-105 cursor-pointer"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path d="M5.5 13a.5.5 0 01.5-.5h2a.5.5 0 010 1H6a.5.5 0 01-.5-.5zm2.5-3a.5.5 0 01.5-.5h2a.5.5 0 010 1H8a.5.5 0 01-.5-.5zm-1-3a.5.5 0 01.5-.5h4a.5.5 0 010 1H8a.5.5 0 01-.5-.5z" />
              <path d="M10 2a8 8 0 100 16 8 8 0 000-16zM2 10a8 8 0 1116 0A8 8 0 012 10z" />
            </svg>
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
        
        {/* Alert message when uploading prducts  */}
        {message && (
          <div className={`mt-4 px-4 py-3 rounded-lg text-center font-medium ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message.text}
          </div>
        )}

        {/* Main Products table  */}
        
        <ProductsTable
          products={currentProducts}
          loading={loading}
          error={error}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
        
        {/* Pagination Controls */}
        {!loading && !error && products.length > productsPerPage && (
          <div className="flex justify-center items-center mt-6 space-x-2">
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className="px-4 py-2 border rounded-full text-sm font-semibold text-gray-700 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Previous
            </button>
            {pageNumbers.map((number) => (
              <button
                key={number}
                onClick={() => paginate(number)}
                className={`px-4 py-2 border rounded-full text-sm font-semibold transition-colors ${
                  currentPage === number
                    ? 'bg-blue-600 text-white shadow-md'
                    : 'bg-white text-gray-700 hover:bg-gray-100'
                }`}
              >
                {number}
              </button>
            ))}
            {showEllipsis && (
              <span className="px-4 py-2 text-gray-500 text-sm">...</span>
            )}
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="px-4 py-2 border rounded-full text-sm font-semibold text-gray-700 bg-white hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Next
            </button>
          </div>
        )}

      </div>
      
      {/* Modal */}
      <Modal isOpen={isModalOpen} onClose={closeModalAndReset}>
        {/* <ProductForm
          editingProduct={editingProduct}
          onProductSaved={fetchProducts}
          onClose={closeModalAndReset}
        /> */}
        <ProductForm
          editingProduct={editingProduct}
          onProductSaved={() => fetchProducts(true)} //  keep current page
          onClose={closeModalAndReset}
        />
      </Modal>


    </div>
  );
};


export default Products;