import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

const EditMenu = () => {
    const [leads, setLeads] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [leadToDelete, setLeadToDelete] = useState(null);
    const navigate = useNavigate();

    // --- Data Fetching ---
    const fetchClients = async () => {
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
                    year: 'numeric'
                }),
                place: client.place,
            }));
            setLeads(clients);
        } catch (error) {
            console.error('Error fetching clients:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchClients();
    }, []);

    // --- Delete Logic Handlers ---
    const openDeleteModal = (lead) => {
        setLeadToDelete(lead);
        setIsModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsModalOpen(false);
        setLeadToDelete(null);
    };

    // --- UPDATED DELETE FUNCTION ---
    const handleDelete = async () => {
        if (!leadToDelete) return;

        try {
            const menuId = leadToDelete.id;

            // 1. Explicitly delete the Invoice record first (using your table name 'invoices')
            // NOTE: This assumes you have an API route to delete the invoice by menu_id.
            // If you only have DELETE /api/invoices/:id, you'd need to fetch the invoice ID first.
            // Assuming your backend handles deletion by menu ID or that the cascade works cleanly.
            // For safety, let's use a dedicated menu-based endpoint if available:
            
            // Assuming a dedicated API endpoint to delete the invoice linked to this menu:
            // await axios.delete(`http://localhost:4000/api/invoices/by-menu/${menuId}`); 

            // 2. Delete the main Menu/Client record. 
            // This relies on PostgreSQL's ON DELETE CASCADE to clean up menu_contexts, menu_categories, menu_items, and invoices.
            // We still delete the menu last to ensure related records are identified/removed first.
            await axios.delete(`http://localhost:4000/api/menus/${menuId}`);
            
            // If the CASCADE delete fails for invoices, uncomment the explicit delete (step 1).

            // Close modal and refresh the list
            closeDeleteModal();
            fetchClients(); 
        } catch (error) {
            console.error('Error deleting client and related data:', error);
            alert('Failed to delete the client record or its related data. Check server logs.');
            closeDeleteModal();
        }
    };
    // -------------------------------

    // --- Render (Unchanged) ---
    return (
        <div className="container mx-auto p-4 sm:px-6 lg:px-8">
            
            <div className="flex justify-between items-center py-6">
                <h2 className="text-3xl font-bold text-gray-900 border-b-4 border-indigo-500 pb-1">
                    Client Invoices 📝
                </h2>
            </div>

            <div className="bg-white shadow-xl overflow-hidden rounded-xl border border-gray-200">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">#</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Client Name / Place</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider hidden sm:table-cell">Phone</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Event Date</th>
                                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-40">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {loading ? (
                                <tr><td colSpan="5" className="px-6 py-12 text-center text-sm text-gray-500">
                                    <div className="inline-block h-4 w-4 animate-spin rounded-full border-2 border-solid border-current border-r-transparent mr-2 text-indigo-600"></div> 
                                    Loading data...
                                </td></tr>
                            ) : leads.length === 0 ? (
                                <tr><td colSpan="5" className="px-6 py-12 text-center text-sm font-medium text-red-500">No data available.</td></tr>
                            ) : (
                                leads.map((lead, i) => (
                                    <tr key={lead.id} className="hover:bg-indigo-50 transition duration-150 ease-in-out">
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{i + 1}.</td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <div className="text-sm font-semibold text-gray-900">{lead.name}</div>
                                            <div className="text-xs text-gray-500">{lead.place}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 hidden sm:table-cell">{lead.phone}</td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{lead.EventDate}</td>
                                        
                                        <td className="px-6 py-4 whitespace-nowrap text-left text-sm font-medium flex items-center space-x-2">
                                            
                                            <button 
                                                className="text-indigo-600 hover:text-indigo-900 font-medium"
                                                onClick={() => navigate(`/edit-menu/${lead.id}`)}
                                            >
                                                Edit/View
                                            </button>
                                            
                                            <span className="text-gray-300">|</span> 
                                            
                                            <button 
                                                className="text-red-600 hover:text-red-900 font-medium"
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

            {/* Delete Confirmation Modal */}
            {isModalOpen && leadToDelete && (
                <div className="fixed inset-0 bg-gray-600 bg-opacity-75 flex items-center justify-center z-50 transition-opacity">
                    <div className="bg-white rounded-lg shadow-2xl p-6 w-full max-w-sm m-4">
                        <h3 className="text-xl font-bold text-gray-900 mb-4">Confirm Deletion</h3>
                        <p className="text-sm text-gray-700 mb-6">
                            Are you sure you want to delete the invoice for **{leadToDelete.name}** ({leadToDelete.EventDate})? 
                            This action cannot be undone and will delete all related menu and invoice data.
                        </p>
                        <div className="flex justify-end space-x-3">
                            <button
                                onClick={closeDeleteModal}
                                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 transition"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 transition shadow-md"
                            >
                                Yes, Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default EditMenu;