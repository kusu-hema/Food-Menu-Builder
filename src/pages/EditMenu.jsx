import React, { useState } from 'react';
import '../assets/css/style.css';

const EditMenu = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [leads, setLeads] = useState([
    { id: 1, name: 'Ravi Kumar', phone: '9876543210' , EventDate : '15-Aug'},
    { id: 2, name: 'Anjali Sharma', phone: '9123456780', EventDate : '16-Aug'},
    { id: 3, name: 'Arjun Patel', phone: '9988776655', EventDate : '17-Aug' },
  ]); 

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    EventDate : '' 
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const newLead = { id: leads.length + 1, ...formData };
    setLeads([...leads, newLead]);
    setFormData({ name: '', phone: '', type: '', location: '', status: '' });
    setModalOpen(false);
  };

  return (
    <div className="leads-container">
      <h4 className="leads-heading pt-5">Invoices</h4>

      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>SNo</th>
              <th>Name</th>
              <th>Phone</th>
              <th>Event Date </th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {leads.length === 0 ? (
              <tr>
                <td colSpan="7">No data available</td>
              </tr>
            ) : (
              leads.map((lead, i) => (
                <tr key={lead.id}>
                  <td>{i + 1}.</td>
                  <td>{lead.name}</td>
                  <td>{lead.phone}</td>
                  <td>{lead.EventDate}</td>
                  <td>Edit | Share</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

    </div>
  );
};

export default EditMenu;
