import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";
// Note: You might need to install and import a library like 'react-icons' for true icons
// For simplicity, I'm using emojis here.

const EditMenu = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);
  const navigate = useNavigate();

  // Fetch all menus/clients
  const fetchClients = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:4000/api/menus');
      const clients = response.data.map(client => ({
        id: client.id,
        name: client.customer_name,
        phone: client.contact,
        EventDate: new Date(client.date).toLocaleDateString('en-GB', {
          day: '2-digit',
          month: 'short',
          year: 'numeric',
        }),
        place: client.place,
      }));
      setLeads(clients);
    } catch (error) {
      console.error('Error fetching clients:', error);
      setAlertMessage('Failed to fetch client data from the server.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchClients();
  }, [fetchClients]);

  const openDeleteModal = (lead) => {
    setLeadToDelete(lead);
    setIsModalOpen(true);
  };

  const closeDeleteModal = () => {
    setIsModalOpen(false);
    setLeadToDelete(null);
  };

  const closeAlert = () => {
    setAlertMessage(null);
  };

  const handleDelete = async () => {
    if (!leadToDelete) return;
    try {
      const menuId = leadToDelete.id;
      await axios.delete(`http://localhost:4000/api/menus/${menuId}`);
      closeDeleteModal();
      fetchClients();
    } catch (error) {
      console.error('Error deleting client:', error);
      setAlertMessage('Failed to delete the client record or related data.');
      closeDeleteModal();
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-4xl font-extrabold text-gray-800">
          Client Invoices 🧾
        </h2>
        <button
          onClick={() => navigate('/menu')} // Corrected: Comment removed from inside the attribute
          className="flex items-center space-x-2 px-6 py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition duration-150 ease-in-out transform hover:scale-105"
        >
          <span>+ New Menu</span>
        </button>
      </div>

      <div className="bg-white shadow-2xl overflow-hidden rounded-xl">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-xl">#</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client Name / Place</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event Date</th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider w-40 rounded-tr-xl">Actions</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    <span className="animate-spin inline-block mr-2">⚙️</span> Loading client data...
                  </td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    No client invoices found. Click '+ New Menu' to add one.
                  </td>
                </tr>
              ) : (
                leads.map((lead, i) => (
                  <tr key={lead.id} className="hover:bg-indigo-50 transition duration-100">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{i + 1}.</td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="font-semibold text-gray-900">{lead.name}</div>
                      <div className="text-xs text-gray-500">{lead.place}</div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 hidden sm:table-cell">{lead.phone}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600 font-medium">{lead.EventDate}</td>

                    <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
                      <div className="flex space-x-2 justify-center">
                        <button
                          className="text-sm font-medium flex items-center px-3 py-1 border border-transparent rounded-md shadow-sm text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition"
                          onClick={() => navigate(`/displaymenu/${lead.id}`)}
                        >
                          ✏️ Edit
                        </button>
                        <button
                          className="text-sm font-medium flex items-center px-3 py-1 border border-transparent rounded-md shadow-sm text-white bg-green-500 hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 transition"
                          onClick={() => navigate(`/displaymenu/${lead.id}`)}
                        >
                          👁️ View
                        </button>

                        <button
                          className="text-sm font-medium flex items-center px-3 py-1 border border-transparent rounded-md shadow-sm text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition"
                          onClick={() => openDeleteModal(lead)}
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Deletion Confirmation Modal */}
      {isModalOpen && leadToDelete && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl max-w-lg w-full transform transition-all scale-100 opacity-100">
            <h3 className="text-2xl font-bold text-red-600 mb-2 flex items-center">
              ⚠️ Confirm Deletion
            </h3>
            <p className="text-gray-700 mb-6">
              Are you absolutely sure you want to delete the invoice for **{leadToDelete.name}**? This action cannot be undone.
            </p>

            <div className="flex justify-end space-x-3">
              <button 
                onClick={closeDeleteModal} 
                className="px-5 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 transition"
              >
                Cancel
              </button>
              <button 
                onClick={handleDelete} 
                className="px-5 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Error Alert Message */}
      {alertMessage && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-6 sm:p-8 rounded-2xl shadow-2xl max-w-lg w-full border-t-4 border-red-500">
            <h3 className="text-2xl font-bold text-red-600 mb-2 flex items-center">
              ❌ Error
            </h3>
            <p className="text-gray-700 mb-6">{alertMessage}</p>

            <div className="flex justify-end">
              <button 
                onClick={closeAlert} 
                className="px-5 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 transition"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default EditMenu;