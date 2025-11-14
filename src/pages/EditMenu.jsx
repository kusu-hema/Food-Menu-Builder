import React, { useState, useEffect } from 'react';
import axios from 'axios';
import '../assets/css/style.css';

const EditMenu = () => {
  const [leads, setLeads] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch clients from API
  useEffect(() => {
    const fetchClients = async () => {
      try {
        const response = await axios.get('http://localhost:4000/api/menus');
        // Map API data to match your table structure
        const clients = response.data.map(client => ({
          id: client.id,
          name: client.customer_name,
          phone: client.contact,
          EventDate: new Date(client.date).toLocaleDateString('en-GB', {
            day: '2-digit',
            month: 'short',
          }),
          place: client.place,
        }));
        setLeads(clients);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching clients:', error);
        setLoading(false);
      }
    };

    fetchClients();
  }, []);

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
              <th>Event Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5">Loading...</td>
              </tr>
            ) : leads.length === 0 ? (
              <tr>
                <td colSpan="5">No data available</td>
              </tr>
            ) : (
              leads.map((lead, i) => (
                <tr key={lead.id}>
                  <td>{i + 1}.</td>
                  <td>{lead.name}</td>
                  <td>{lead.phone}</td>
                  <td>{lead.EventDate}</td>
                  <td>
                    <button className="action-btn">Edit</button> |{' '}
                    <button className="action-btn">Share</button>
                  </td>
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
