import React, { useState, useEffect } from 'react';
import '../assets/css/style.css';

const Leads = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [leads, setLeads] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    // start: '',
    // end: '',
    type: '',
    location: '',
    status: '',
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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    fetch('http://localhost:4000/api/customers', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to create lead');
        return res.json();
      })
      .then((data) => {
        console.log('User created:', data);
        setModalOpen(false);
        setFormData({
          name: '',
          phone: '',
          start: '',
          end: '',
          type: '',
          location: '',
          status: '',
        });
        fetchLeads();
      })
      .catch((err) => {
        console.error('Error creating user:', err);
      });
  };

  return (
    <div className="leads-container">
      <h2 className="leads-heading pt-5">Hello Shanmukha 👋🏻,</h2>

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

      <div className="leads-controls px-2 sm:px-4 md:px-6 lg:px-8 xl:px-10">
        <div className="leads-search-group flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 sm:gap-4">
          <input
            type="text"
            placeholder="Search"
            className="leads-search-input w-full sm:w-64 px-2 py-1 text-sm border rounded-md"
          />
          <span className="leads-total-orders text-sm sm:text-base">
            {leads.length} Orders
          </span>
        </div>

        <div className="flex flex-wrap justify-start sm:justify-end gap-2 mt-4">
          <button className="button-style px-3 py-1 text-sm bg-blue-500 text-black rounded-md">
            ⬇️ Export
          </button>
          <button className="button-style px-3 py-1 text-sm bg-gray-300 text-black rounded-md">
            ⚙️ Sort: Default
          </button>
          <button
            onClick={() => setModalOpen(true)}
            className="button-add px-3 py-1 text-sm bg-green-500 text-white rounded-md"
          >
            + Add New User
          </button>
        </div>
      </div>


      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>SNo</th>
              <th>Name</th>
              <th>Phone</th>
              {/* <th>Start Date</th> */}
              {/* <th>End Date</th> */}
              <th>Type</th>
              <th>Location</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 ? (
              <tr>
                <td colSpan="9">No data available</td>
              </tr>
            ) : (
              leads.map((lead, i) => (
                <tr key={lead.id ?? i}>
                  <td>{i + 1}.</td>
                  <td>{lead.name}</td>
                  <td>{lead.phone}</td>
                  {/* <td>{lead.start}</td> */}
                  {/* <td>{lead.end_date}</td> */}
                  <td>{lead.type}</td>
                  <td>{lead.location}</td>
                  <td>
                    <span className="status-badge">{lead.status}</span>
                  </td>
                  <td>Edit | Share</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Add New User</h3>
            <form onSubmit={handleSubmit} className="modal-form">
              {['name', 'phone', 'start', 'end_date', 'type', 'location', 'status'].map((field) => (
                <input
                  key={field}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  required
                />
              ))}
              <div className="modal-buttons">
                <button type="button" onClick={() => setModalOpen(false)} className="button-style cancel-button">
                  Cancel
                </button>
                <button type="submit" className="button-add">
                  Save User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Leads;
