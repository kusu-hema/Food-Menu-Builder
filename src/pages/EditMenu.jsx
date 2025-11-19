import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

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
    <div className="container mx-auto p-4 sm:px-6 lg:px-8">
      <div className="flex justify-between items-center py-6">
        <h2 className="text-3xl font-bold text-gray-900 border-b-4 border-indigo-500 pb-1">
          Client Invoices 📝
        </h2>
        <button
          onClick={() => navigate('/addmenu')}
          className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          + New Menu
        </button>
      </div>

      <div className="bg-white shadow-xl overflow-hidden rounded-xl border border-gray-200">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3">#</th>
                <th className="px-6 py-3">Client Name / Place</th>
                <th className="px-6 py-3 hidden sm:table-cell">Phone</th>
                <th className="px-6 py-3">Event Date</th>
                <th className="px-6 py-3 w-40">Actions</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">Loading...</td>
                </tr>
              ) : leads.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center">No data available.</td>
                </tr>
              ) : (
                leads.map((lead, i) => (
                  <tr key={lead.id} className="hover:bg-indigo-50">
                    <td className="px-6 py-4">{i + 1}.</td>
                    <td className="px-6 py-4">
                      <div className="font-semibold">{lead.name}</div>
                      <div className="text-xs text-gray-500">{lead.place}</div>
                    </td>

                    <td className="px-6 py-4 hidden sm:table-cell">{lead.phone}</td>
                    <td className="px-6 py-4">{lead.EventDate}</td>

                    <td className="px-6 py-4 flex space-x-3">
                      <button
                        className="text-indigo-600 hover:text-indigo-900"
                        onClick={() => navigate(`/displaymenu/${lead.id}`)}
                      >
                        Edit/View
                      </button>

                      <button
                        className="text-red-600 hover:text-red-900"
                        onClick={() => openDeleteModal(lead)}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && leadToDelete && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm">
            <h3 className="text-xl font-bold">Confirm Deletion</h3>
            <p>Are you sure you want to delete this record?</p>

            <div className="flex justify-end space-x-3 mt-4">
              <button onClick={closeDeleteModal} className="px-4 py-2 bg-gray-200 rounded">
                Cancel
              </button>
              <button onClick={handleDelete} className="px-4 py-2 bg-red-600 text-white rounded">
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {alertMessage && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl shadow-xl max-w-sm">
            <h3 className="text-xl font-bold text-red-600">Error</h3>
            <p>{alertMessage}</p>

            <div className="flex justify-end mt-4">
              <button onClick={closeAlert} className="px-4 py-2 bg-red-600 text-white rounded">
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
