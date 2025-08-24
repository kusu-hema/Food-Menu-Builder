import React, { useState, useEffect, useRef } from 'react';
import * as XLSX from 'xlsx';

/**
 * Renders the form to create or edit a category.
 * It uses a callback function to notify the parent component (App)
 * when a new category has been successfully created or updated,
 * allowing the parent to refresh the data in the table.
 *
 * @param {object} props - The component props.
 * @param {object} props.editingCategory - The category object to edit, or null for a new category.
 * @param {function} props.onCategorySaved - A callback function to call after a successful save (create/update).
 * @param {function} props.onClose - A callback to close the modal.
 */
const CategoryForm = ({ editingCategory, onCategorySaved, onClose }) => {
  // State for the form fields
  const [categoryName, setCategoryName] = useState('');
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState(null);

  // Use a useEffect hook to populate the form fields when a category is selected for editing
  useEffect(() => {
    if (editingCategory) {
      setCategoryName(editingCategory.category_name);
      // We don't set the image here as we don't have the file object,
      // but we will display a preview of the existing image if one exists.
    } else {
      // Clear form for new category creation
      setCategoryName('');
      setImage(null);
    }
  }, [editingCategory]); // This effect runs whenever editingCategory changes

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null); // Reset message on new submission

    // Create a FormData object to handle file and text data
    const formData = new FormData();
    // Only append a new image if one has been selected
    if (image) {
      formData.append('image', image);
    }
    // Append the category name, which is a required field
    formData.append('category_name', categoryName);

    // Determine the API endpoint and HTTP method based on whether we are editing or creating
    const isEditing = !!editingCategory;
    const url = isEditing
      ? `http://localhost:4000/api/categories/${editingCategory.sno}`
      : 'http://localhost:4000/api/categories';
    const method = isEditing ? 'PUT' : 'POST';

    try {
      const response = await fetch(url, {
        method: method,
        body: formData,
      });

      if (response.ok) {
        const successMessage = isEditing
          ? 'Category updated successfully!'
          : 'Category created successfully!';
        setMessage({ text: successMessage, type: 'success' });

        // Call the callback to trigger a refresh in the table component
        onCategorySaved();
        // Close the modal after a short delay
        setTimeout(onClose, 1000);
      } else {
        const errorData = await response.json();
        setMessage({ text: `Error: ${errorData.message}`, type: 'error' });
      }
    } catch (error) {
      console.error(`Error saving category:`, error);
      setMessage({ text: 'Failed to connect to the server.', type: 'error' });
    }
  };

  return (
    <div className="bg-white p-6 rounded-2xl shadow-xl w-full max-w-sm">
      <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
        {editingCategory ? 'Edit Category' : 'Add New Category'}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="categoryName" className="block text-sm font-medium text-gray-700">Category Name</label>
          <input
            type="text"
            id="categoryName"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div>
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image</label>
          {/* Display current image when in editing mode */}
          {editingCategory && editingCategory.image && (
            <div className="mt-2 mb-4">
              <span className="block text-xs text-gray-500 mb-1">Current Image:</span>
              <img
                src={`http://localhost:4000/${editingCategory.image}`}
                alt="Current category"
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
          {editingCategory ? 'Save Changes' : 'Add Category'}
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
 * Renders the table of categories with edit and delete buttons.
 *
 * @param {object} props - The component props.
 * @param {Array<object>} props.categories - The list of categories to display.
 * @param {object} props.productCounts - An object containing category names and their corresponding product counts.
 * @param {boolean} props.loading - Loading state.
 * @param {string} props.error - Error message.
 * @param {function} props.onEdit - Callback for editing a category.
 * @param {function} props.onDelete - Callback for deleting a category.
 */
const CategoriesTable = ({ categories, productCounts, loading, error, onEdit, onDelete }) => {
  return (
    <div className="rounded-lg p-6 w-full max-w-2xl">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Categories Table</h1>
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
                    Category Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Actions
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
                      {category.image && (
                        <img
                          src={`http://localhost:4000/${category.image}`}
                          alt={category.category_name}
                          className="h-12 w-12 rounded-full object-cover"
                          onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/48x48?text=N/A"; }}
                        />
                      )}
                      {!category.image && (
                        <img
                          src="https://placehold.co/48x48?text=N/A"
                          alt="Not available"
                          className="h-12 w-12 rounded-full object-cover"
                        />
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 capitalize">
                      {category.category_name} ({productCounts[category.category_name.toLowerCase()] || 0})
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm">
                      <button
                        onClick={() => onEdit(category)}
                        className="px-4 py-2 mr-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => onDelete(category.sno)}
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
            {categories.map((category) => (
              <div key={category.sno} className="bg-white p-4 rounded-lg shadow-md border border-gray-200">
                <div className="flex items-center space-x-4 mb-4">
                  {category.image && (
                    <img
                      src={`http://localhost:4000/${category.image}`}
                      alt={category.category_name}
                      className="h-16 w-16 rounded-full object-cover"
                      onError={(e) => { e.target.onerror = null; e.target.src = "https://placehold.co/64x64?text=N/A"; }}
                    />
                  )}
                  {!category.image && (
                    <img
                      src="https://placehold.co/64x64?text=N/A"
                      alt="Not available"
                      className="h-16 w-16 rounded-full object-cover"
                    />
                  )}
                  <div className="flex-1">
                    <div className="font-bold text-gray-900 text-lg capitalize">{category.category_name} ({productCounts[category.category_name.toLowerCase()] || 0})</div>
                    <div className="text-gray-500 text-sm">SNo: {category.sno}</div>
                  </div>
                </div>
                <div className="mt-4 flex space-x-2">
                  <button
                    onClick={() => onEdit(category)}
                    className="flex-1 px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(category.sno)}
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
      {!loading && !error && categories.length === 0 && (
        <div className="flex justify-center items-center h-48">
          <div className="text-xl text-gray-600">No categories found.</div>
        </div>
      )}
    </div>
  );
};

/**
 * This is the main parent component that orchestrates the layout
 * and handles data fetching, state management, and the import/export logic.
 */
const CorporateEvents = () => {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]); // State to store raw products data
  const [productCounts, setProductCounts] = useState({}); // State for product counts
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [importMessage, setImportMessage] = useState(null);
  const [importMessageType, setImportMessageType] = useState(null);
  
  // Hidden file input element for triggering the import process
  const fileInputRef = useRef(null);

  // Function to fetch the categories and product counts from the backend
  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch both categories and products in parallel
      const [categoriesResponse, productsResponse] = await Promise.all([
        fetch('http://localhost:4000/api/categories'),
        fetch('http://localhost:4000/api/products')
      ]);

      if (!categoriesResponse.ok) {
        throw new Error('Failed to fetch categories.');
      }
      if (!productsResponse.ok) {
        throw new Error('Failed to fetch products.');
      }

      const categoriesData = await categoriesResponse.json();
      const productsData = await productsResponse.json();

      // Store the raw product data for the debug panel
      setProducts(productsData);

      // Log the raw data to the console for debugging
      console.log('Categories data from API:', categoriesData);
      console.log('Products data from API:', productsData);

      // Calculate the product counts per category, converting names to lowercase for a consistent match
      const counts = productsData.reduce((acc, product) => {
        // Add a check to ensure product.category is a string before calling toLowerCase()
        if (product && typeof product.category === 'string') {
          const categoryName = product.category.toLowerCase().trim();
          acc[categoryName] = (acc[categoryName] || 0) + 1;
        }
        return acc;
      }, {});
      
      console.log('Calculated product counts:', counts);

      setCategories(categoriesData);
      setProductCounts(counts); // Set the calculated product counts
      setError(null);
    } catch (err) {
      console.error("Error fetching data:", err);
      setError('Failed to fetch data. Please ensure your backend is running.');
    } finally {
      setLoading(false);
    }
  };

  /**
   * Handles exporting the current categories data to an Excel file.
   */
  const handleExport = () => {
    // Prepare the data for the worksheet. We only need s.no, category_name, and image fields.
    const dataToExport = categories.map(({ sno, category_name, image }) => ({
      'S.No': sno,
      'Category Name': category_name,
      'Image URL': image ? `http://localhost:4000/${image}` : 'N/A'
    }));

    // Use the globally available XLSX object to create a worksheet from the JSON data
    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Categories");
    
    // Write the file and trigger the download
    XLSX.writeFile(workbook, "categories_export.xlsx");
  };

  /**
   * Handles the file selection for import.
   * Reads the Excel file and processes the data, then sends it to the backend.
   * @param {Event} event - The file input change event.
   */
  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) {
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      try {
        const data = new Uint8Array(e.target.result);
        const workbook = XLSX.read(data, { type: 'array' });
        
        // Get the first sheet name
        const sheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[sheetName];
        
        // Convert worksheet to a JSON array of objects
        const importedData = XLSX.utils.sheet_to_json(worksheet);
        
        console.log('Importing Excel Data:', importedData);

        // Send the imported data to the backend API for saving
        const response = await fetch('http://localhost:4000/api/categories/bulk-import', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(importedData),
        });

        if (response.ok) {
          setImportMessage("Data imported and saved successfully!");
          setImportMessageType("success");
          fetchData(); // Refresh the data after successful import
        } else {
          const errorData = await response.json();
          setImportMessage(`Error: ${errorData.message}`);
          setImportMessageType("error");
        }

      } catch (error) {
        console.error('Error during file import:', error);
        setImportMessage(`Failed to import file: ${error.message}`);
        setImportMessageType("error");
      }
    };
    reader.readAsArrayBuffer(file);
  };

  // Function to handle category deletion
  const handleDelete = async (sno) => {
    try {
      const response = await fetch(`http://localhost:4000/api/categories/${sno}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete category.');
      }
      // If deletion is successful, refresh the list
      fetchData();
    } catch (err) {
      console.error("Error deleting category:", err);
      setError('Failed to delete category. Please try again.');
    }
  };

  // Function to handle the edit button click
  const handleEdit = (category) => {
    setEditingCategory(category);
    setIsModalOpen(true);
  };

  // Function to close the modal and reset the editing state
  const closeModalAndReset = () => {
    setIsModalOpen(false);
    setEditingCategory(null);
  };

  // Fetch data when the component mounts or after a save/delete
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen p-8 font-sans antialiased">
      <div className="flex flex-col md:flex-row md:justify-center md:items-start space-y-8 md:space-y-0 md:space-x-8">
        {/* Container for the table and the buttons */}
        <div className="w-full max-w-2xl">
          <div className="flex justify-between items-center mb-4 space-x-2">
            <button
              onClick={() => {
                setEditingCategory(null); // Ensure form is for creation
                setIsModalOpen(true);
              }}
              className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition-colors"
            >
              Add New Category
            </button>
            <button
              onClick={handleExport}
              className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors"
            >
              Export to Excel
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImport}
              accept=".xlsx, .xls"
              style={{ display: 'none' }} // Hide the actual file input
            />
            <button
              onClick={() => fileInputRef.current.click()}
              className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-yellow-600 hover:bg-yellow-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-yellow-500 transition-colors"
            >
              Import from Excel
            </button>
          </div>
          <CategoriesTable
            categories={categories}
            productCounts={productCounts} // Pass the product counts as a prop
            loading={loading}
            error={error}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

          {/* Message Box for Import */}
          {importMessage && (
            <div className={`mt-4 px-4 py-3 rounded-lg text-center font-medium ${importMessageType === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
              {importMessage}
            </div>
          )}
        </div>

        {/* Debug Panel - Displays raw API data for troubleshooting */}
        <div className="w-full max-w-sm p-6 bg-gray-900 text-green-400 font-mono rounded-lg shadow-xl">
          <h2 className="text-xl font-bold mb-4 text-center">Debug Panel</h2>
          <div className="space-y-4 text-sm">
            <div>
              <h3 className="text-base font-semibold mb-2">Categories JSON:</h3>
              <pre className="whitespace-pre-wrap break-all">{JSON.stringify(categories, null, 2)}</pre>
            </div>
            <div>
              <h3 className="text-base font-semibold mb-2">Products JSON:</h3>
              <pre className="whitespace-pre-wrap break-all">{JSON.stringify(products, null, 2)}</pre>
            </div>
          </div>
        </div>
      </div>

      {/* The Modal component is now conditionally rendered */}
      <Modal isOpen={isModalOpen} onClose={closeModalAndReset}>
        <CategoryForm
          editingCategory={editingCategory}
          onCategorySaved={fetchData} // Use the new fetchData function here
          onClose={closeModalAndReset}
        />
      </Modal>
    </div>
  );
};

export default CorporateEvents;
