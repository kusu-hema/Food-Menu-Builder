import React, { useState, useEffect } from 'react';
import '../assets/css/style.css';

const Categories = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [leads, setLeads] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    action: '',
    image: null,
  });

  const fetchLeads = () => {
    fetch('http://localhost:4000/api/customers')
      .then((res) => res.json())
      .then((data) => setLeads(data))
      .catch((err) => console.error('Error fetching leads:', err));
  };

  useEffect(() => {
    fetchLeads();
  }, []);

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: files ? files[0] : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const data = new FormData();
    data.append('name', formData.name);
    data.append('action', formData.action);
    data.append('image', formData.image);

    fetch('http://localhost:4000/api/customers', {
      method: 'POST',
      body: data,
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to create lead');
        return res.json();
      })
      .then((data) => {
        console.log('User created:', data);
        setModalOpen(false);
        setFormData({ name: '', action: '', image: null });
        fetchLeads();
      })
      .catch((err) => console.error('Error creating user:', err));
  };

  return (
    <div className="leads-container">
      <h2 className="leads-heading pt-5">Hello Shanmukha 👋🏻,</h2>

      <div className="leads-controls">
        <div className="leads-search-group">
          <input type="text" placeholder="Search" className="leads-search-input" />
          <span className="leads-total-orders">{leads.length} Orders</span>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button className="button-style">⬇️ Export</button>
          <button className="button-style">⚙️ Sort: Default</button>
          <button onClick={() => setModalOpen(true)} className="button-add">
            + Add New Category
          </button>
        </div>
      </div>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>SNo</th>
              <th>Category Name</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 ? (
              <tr>
                <td colSpan="4">No data available</td>
              </tr>
            ) : (
              leads.map((lead, i) => (
                <tr key={lead.id ?? i}>
                  <td>{i + 1}.</td>
                  <td>{lead.name}</td>
                  <td>{lead.status}</td>
                  <td>{lead.action}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add New Category</h3>
            <form onSubmit={handleSubmit} className="modal-form">
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Category Name"
                required
              />
              <input
                name="action"
                value={formData.action}
                onChange={handleChange}
                placeholder="Action"
                required
              />
              <input
                type="file"
                name="image"
                accept="image/*"
                onChange={handleChange}
                required
              />
              <div className="modal-buttons">
                <button type="button" onClick={() => setModalOpen(false)} className="button-style cancel-button">
                  Cancel
                </button>
                <button type="submit" className="button-add">
                  Save Category
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Categories;
