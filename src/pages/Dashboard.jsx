import React, { useState, useEffect } from 'react';
import '../assets/css/style.css';

const Dashboard = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [leads, setLeads] = useState([]);
  const [filteredLeads, setFilteredLeads] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    start: '', 
    end_date: '',
    type: '',
    location: '',
    status: '',
  });

  const fetchLeads = () => {
    fetch('http://localhost:4000/api/customers')
      .then((res) => res.json())
      .then((data) => {
        setLeads(data);
        setFilteredLeads(data);
      })
      .catch((err) => console.error('Error fetching leads:', err));
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  // SEARCH FILTER
  useEffect(() => {
    const result = leads.filter((lead) =>
      lead.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.phone.includes(searchTerm)
    );
    setFilteredLeads(result);
  }, [searchTerm, leads]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isEditMode) {
      fetch(`http://localhost:4000/api/customers/${editId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
        .then((res) => res.json())
        .then(() => {
          setModalOpen(false);
          setIsEditMode(false);
          setFormData({
            name: '',
            phone: '',
            start: '',
            end_date: '',
            type: '',
            location: '',
            status: '',
          });
          fetchLeads();
        })
        .catch((err) => console.error('Update error:', err));
    } else {
      fetch('http://localhost:4000/api/customers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })
        .then((res) => res.json())
        .then(() => {
          setModalOpen(false);
          setFormData({
            name: '',
            phone: '',
            start: '',
            end_date: '',
            type: '',
            location: '',
            status: '',
          });
          fetchLeads();
        })
        .catch((err) => console.error('Create error:', err));
    }
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this user?")) return;
    fetch(`http://localhost:4000/api/customers/${id}`, { method: 'DELETE' })
      .then(() => fetchLeads())
      .catch((err) => console.error('Delete error:', err));
  };

  const handleEdit = (lead) => {
    setIsEditMode(true);
    setEditId(lead.id);
    setFormData({
      name: lead.name,
      phone: lead.phone,
      start: lead.start,
      end_date: lead.end_date,
      type: lead.type,
      location: lead.location,
      status: lead.status,
    });
    setModalOpen(true);
  };

  return (
    <div className="leads-container">
      <h2 className="leads-heading pt-5">Hello Shanmukha 👋🏻,</h2>

      {/* Cards */}
      <div className="leads-cards">
        {[ 
          { title: 'New Orders', count: 12, color: '#f78f1e' },
          { title: 'Accepting orders', count: 10, color: '#f6c40d' },
          { title: 'On Way Orders', count: 20, color: '#5b8def' },
          { title: 'Delivered orders', count: 12, color: '#43d39e' },
        ].map((card, index) => (
          <div key={index} className="card" style={{ borderTop: `6px solid ${card.color}` }}>
            <h4>{card.title}</h4>
            <h2>{card.count}</h2>
            <p className="card-subtext">This week</p>
          </div>
        ))}
      </div>

      {/* Search + Buttons */}
      <div className="leads-controls px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10">
        <div className="leads-search-group flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
          <div className="relative w-full sm:w-64">
            <input
              type="text"
              placeholder="🔍 Search by Name or Phone"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="leads-search-input w-full px-3 py-2 text-sm border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
            />
          </div>
          <span className="leads-total-orders text-sm sm:text-base font-medium">
            {filteredLeads.length} Orders
          </span>
        </div>

        <div className="flex flex-wrap justify-start sm:justify-end gap-2 mt-4">
          <button className="button-style px-3 py-1 text-sm bg-blue-500 text-white rounded-md hover:bg-blue-600">
            ⬇️ Export
          </button>
          <button className="button-style px-3 py-1 text-sm bg-gray-300 text-black rounded-md hover:bg-gray-400">
            ⚙️ Sort: Default
          </button>
          <button
            onClick={() => {
              setIsEditMode(false);
              setFormData({
                name: '',
                phone: '',
                start: '',
                end_date: '',
                type: '',
                location: '',
                status: '',
              });
              setModalOpen(true);
            }}
            className="button-add px-3 py-1 text-sm bg-green-500 text-white rounded-md hover:bg-green-600"
          >
            + Add New User
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="table-container mt-4">
        <table className="table w-full border-collapse text-left">
          <thead>
            <tr>
              <th>SNo</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Type</th>
              <th>Location</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {filteredLeads.length === 0 ? (
              <tr>
                <td colSpan="9" className="text-center py-4">No data available</td>
              </tr>
            ) : (
              filteredLeads.map((lead, i) => (
                <tr key={lead.id ?? i} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-1">{i + 1}.</td>
                  <td className="py-2 px-1">{lead.name}</td>
                  <td className="py-2 px-1">{lead.phone}</td>
                  <td className="py-2 px-1">{lead.type}</td>
                  <td className="py-2 px-1">{lead.location}</td>
                  <td className="py-2 px-1">
                    <span className="status-badge px-2 py-1 rounded-full bg-yellow-200 text-yellow-800">{lead.status}</span>
                  </td>
                  <td className="py-2 px-1 flex gap-2">
                    <button
                      onClick={() => handleEdit(lead)}
                      className="px-2 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(lead.id)}
                      className="px-2 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
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

      {/* Add/Edit Modal */}
      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>{isEditMode ? "Edit User" : "Add New User"}</h3>
            <form onSubmit={handleSubmit} className="modal-form flex flex-col gap-2">
              {['name', 'phone', 'start', 'end_date', 'type', 'location', 'status'].map((field) => (
                <input
                  key={field}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  className="px-3 py-2 border rounded focus:outline-none focus:ring-2 focus:ring-blue-400"
                  required
                />
              ))}

              <div className="modal-buttons flex justify-end gap-2 mt-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-3 py-1 bg-gray-300 text-black rounded hover:bg-gray-400"
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                >
                  {isEditMode ? "Update User" : "Save User"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
