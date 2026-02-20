import React, { useState, useEffect, useCallback, useMemo } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const EditMenu = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState(null);
  const [alertMessage, setAlertMessage] = useState(null);
  
  // --- SEARCH & PAGINATION STATE ---
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5; 
  
  const navigate = useNavigate();

  // Fetch all menus
  const fetchClients = useCallback(async () => {
    setLoading(true);
    try {
      const response = await axios.get('http://localhost:4000/api/menus');
      const clients = response.data.map(client => ({
        id: client.id, // Ensure this matches your DB primary key
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

  // --- LOGIC: SEARCH FILTERING ---
  const filteredLeads = useMemo(() => {
    return leads.filter(lead => 
      lead.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.place?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone?.includes(searchQuery)
    );
  }, [leads, searchQuery]);

  // --- LOGIC: PAGINATION CALCULATION ---
  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
  
  const currentTableData = useMemo(() => {
    const firstPageIndex = (currentPage - 1) * itemsPerPage;
    const lastPageIndex = firstPageIndex + itemsPerPage;
    return filteredLeads.slice(firstPageIndex, lastPageIndex);
  }, [currentPage, filteredLeads]);

  const handleSearch = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to first page on new search
  };

  // --- ACTIONS ---
  const openDeleteModal = (lead) => { 
    setLeadToDelete(lead); 
    setIsModalOpen(true); 
  };
  
  const closeDeleteModal = () => { 
    setIsModalOpen(false); 
    setLeadToDelete(null); 
  };

  // FIXED DELETE LOGIC
  const handleDelete = async () => {
    if (!leadToDelete) return;
    try {
      // 1. Backend Call
      await axios.delete(`http://localhost:4000/api/menus/${leadToDelete.id}`);
      
      // 2. Optimistic State Update (Remove from UI immediately)
      const updatedLeads = leads.filter(lead => lead.id !== leadToDelete.id);
      setLeads(updatedLeads);
      
      // 3. Pagination Adjustment
      // If we deleted the last item on the last page, go back one page
      const newTotalFiltered = filteredLeads.length - 1;
      const newTotalPages = Math.ceil(newTotalFiltered / itemsPerPage);
      if (currentPage > newTotalPages && newTotalPages > 0) {
        setCurrentPage(newTotalPages);
      }

      closeDeleteModal();
    } catch (error) {
      console.error('Delete error:', error);
      setAlertMessage('Failed to delete the record. Please check if the ID exists.');
      closeDeleteModal();
    }
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      
      {/* HEADER & SEARCH SECTION */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <h2 className="text-4xl font-extrabold text-gray-800">Client Invoices 🧾</h2>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-gray-400">🔍</span>
            <input 
              type="text"
              placeholder="Search invoices..."
              value={searchQuery}
              onChange={handleSearch}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 outline-none w-full sm:w-64 transition"
            />
          </div>

          <button
            onClick={() => navigate('/menu')}
            className="flex items-center justify-center space-x-2 px-6 py-2 bg-indigo-600 text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 transition transform hover:scale-105"
          >
            <span>+ New Menu</span>
          </button>
        </div>
      </div>

      {/* TABLE SECTION */}
      <div className="bg-white shadow-2xl overflow-hidden rounded-xl border border-gray-100">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">#</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Client / Place</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase hidden sm:table-cell">Phone</th>
                <th className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase">Event Date</th>
                <th className="px-6 py-3 text-center text-xs font-semibold text-gray-500 uppercase w-40">Actions</th>
              </tr>
            </thead>

            <tbody className="bg-white divide-y divide-gray-100">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500">
                    <span className="animate-spin inline-block mr-2 text-xl">⚙️</span> Loading...
                  </td>
                </tr>
              ) : currentTableData.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-gray-500 italic">
                    {searchQuery ? `No results for "${searchQuery}"` : "No client invoices found."}
                  </td>
                </tr>
              ) : (
                currentTableData.map((lead, i) => (
                  <tr key={lead.id} className="hover:bg-indigo-50 transition duration-100">
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {(currentPage - 1) * itemsPerPage + i + 1}.
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-gray-900">{lead.name}</div>
                      <div className="text-xs text-gray-500">{lead.place}</div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-600 hidden sm:table-cell">{lead.phone}</td>
                    <td className="px-6 py-4 text-sm text-gray-600 font-medium">{lead.EventDate}</td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex space-x-2 justify-center">
                        <button onClick={() => navigate(`/displaymenu/${lead.id}`)} className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600">✏️</button>
                        <button onClick={() => navigate(`/displaymenu/${lead.id}`)} className="p-2 bg-green-500 text-white rounded hover:bg-green-600">👁️</button>
                        <button onClick={() => openDeleteModal(lead)} className="p-2 bg-red-600 text-white rounded hover:bg-red-700">🗑️</button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION FOOTER */}
        {!loading && totalPages > 1 && (
          <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
            <div className="text-sm text-gray-700">
              Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredLeads.length)}</span> of <span className="font-medium">{filteredLeads.length}</span> results
            </div>
            <div className="flex space-x-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => prev - 1)}
                className={`px-3 py-1 border rounded ${currentPage === 1 ? 'bg-gray-100 text-gray-400' : 'bg-white hover:bg-gray-50'}`}
              >
                Prev
              </button>
              {[...Array(totalPages)].map((_, index) => (
                <button
                  key={index + 1}
                  onClick={() => setCurrentPage(index + 1)}
                  className={`px-3 py-1 border rounded hidden sm:block ${currentPage === index + 1 ? 'bg-indigo-600 text-white' : 'bg-white hover:bg-gray-50'}`}
                >
                  {index + 1}
                </button>
              ))}
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => prev + 1)}
                className={`px-3 py-1 border rounded ${currentPage === totalPages ? 'bg-gray-100 text-gray-400' : 'bg-white hover:bg-gray-50'}`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>

      {/* DELETE MODAL */}
      {isModalOpen && leadToDelete && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full">
            <h3 className="text-2xl font-bold text-red-600 mb-2">⚠️ Confirm Deletion</h3>
            <p className="text-gray-700 mb-6">
              Delete invoice for <strong>{leadToDelete.name}</strong>? This cannot be undone.
            </p>
            <div className="flex justify-end space-x-3">
              <button onClick={closeDeleteModal} className="px-5 py-2 border rounded-lg hover:bg-gray-100">Cancel</button>
              <button onClick={handleDelete} className="px-5 py-2 bg-red-600 text-white font-semibold rounded-lg hover:bg-red-700 transition">Yes, Delete</button>
            </div>
          </div>
        </div>
      )}

      {/* ERROR ALERT */}
      {alertMessage && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white p-8 rounded-2xl max-w-md w-full border-t-4 border-red-500">
            <h3 className="text-2xl font-bold text-red-600 mb-2">❌ Error</h3>
            <p className="text-gray-700 mb-6">{alertMessage}</p>
            <button onClick={() => setAlertMessage(null)} className="w-full py-2 bg-red-600 text-white rounded-lg">Close</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default EditMenu;