import React, { useState } from 'react';

const Leads = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    start: '',
    end: '',
    type: '',
    location: '',
    status: 'New',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('New User Data:', formData);
    // You can call your backend API here
    setModalOpen(false); // close modal
  };

  const styles = {
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      minWidth: '700px',
    },
    thtd: {
      padding: '12px 15px',
      textAlign: 'left',
      borderBottom: '1px solid #eee',
      fontSize: '14px',
    },
    status: {
      padding: '5px 10px',
      background: '#f2f2f2',
      borderRadius: '8px',
      fontSize: '13px',
    },
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2 style={{ marginBottom: '20px' }}>Hello Shanmukha 👋🏻,</h2>

      {/* Cards */}
      <div style={{ display: 'flex', gap: '20px', flexWrap: 'wrap', marginBottom: '30px' }}>
        {[
          { title: 'New Orders', count: 12, color: '#f78f1e' },
          { title: 'Await Accepting orders', count: 10, color: '#f6c40d' },
          { title: 'On Way Orders', count: 20, color: '#5b8def' },
          { title: 'Delivered orders', count: 12, color: '#43d39e' }
        ].map((card, index) => (
          <div key={index} style={{
            background: '#fff',
            borderRadius: '15px',
            padding: '20px',
            boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
            width: '200px',
            borderTop: `6px solid ${card.color}`,
            flexGrow: 1,
            minWidth: '150px'
          }}>
            <h4>{card.title}</h4>
            <h2>{card.count}</h2>
            <p style={{ color: '#888' }}>This week</p>
          </div>
        ))}
      </div>

      {/* Search and Actions */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
        flexWrap: 'wrap',
        gap: '10px'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <input
            type="text"
            placeholder="Search"
            style={{
              padding: '10px 15px',
              borderRadius: '10px',
              border: '1px solid #ddd',
              outline: 'none'
            }}
          />
          <span style={{ fontWeight: 'bold', fontSize: '18px' }}>180 Orders</span>
        </div>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <button style={btnStyle}>⬇️ Export</button>
          <button style={btnStyle}>⚙️ Sort: Default</button>
          <button onClick={() => setModalOpen(true)} style={{
            padding: '10px 20px',
            background: 'linear-gradient(90deg, #845ef7, #a084f7)',
            color: '#fff',
            border: 'none',
            borderRadius: '10px',
            cursor: 'pointer'
          }}>+ Add New User</button>
        </div>
      </div>

      {/* Table */}
      <div style={{
        background: '#fff',
        borderRadius: '15px',
        padding: '20px',
        boxShadow: '0 4px 10px rgba(0,0,0,0.1)',
        overflowX: 'auto'
      }}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.thtd}>SNo</th>
              <th style={styles.thtd}>Name</th>
              <th style={styles.thtd}>Phone</th>
              <th style={styles.thtd}>Start Date</th>
              <th style={styles.thtd}>End Date</th>
              <th style={styles.thtd}>Type</th>
              <th style={styles.thtd}>Location</th>
              <th style={styles.thtd}>Status</th>
              <th style={styles.thtd}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {/* Sample rows */}
            {[...Array(5)].map((_, i) => (
              <tr key={i}>
                <td style={styles.thtd}>{i + 1}.</td>
                <td style={styles.thtd}>Ramya</td>
                <td style={styles.thtd}>9848XXXXXXXX</td>
                <td style={styles.thtd}>July 16</td>
                <td style={styles.thtd}>July 17</td>
                <td style={styles.thtd}>Marriage</td>
                <td style={styles.thtd}>Hyderabad</td>
                <td style={styles.thtd}><span style={styles.status}>New</span></td>
                <td style={styles.thtd}>Edit | Share</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {isModalOpen && (
        <div style={{
          position: 'fixed', top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.4)', display: 'flex', justifyContent: 'center', alignItems: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: '#fff',
            padding: '30px',
            borderRadius: '15px',
            width: '90%',
            maxWidth: '500px',
            boxShadow: '0 8px 20px rgba(0,0,0,0.2)'
          }}>
            <h3 style={{ marginBottom: '20px' }}>Add New User</h3>
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {['name', 'phone', 'start', 'end', 'type', 'location'].map((field) => (
                <input
                  key={field}
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  required
                  style={{
                    padding: '10px',
                    borderRadius: '8px',
                    border: '1px solid #ccc',
                    outline: 'none'
                  }}
                />
              ))}
              <select name="status" value={formData.status} onChange={handleChange} required style={{ padding: '10px', borderRadius: '8px' }}>
                <option>New</option>
                <option>Accepted</option>
                <option>Delivered</option>
              </select>

              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <button type="button" onClick={() => setModalOpen(false)} style={{ ...btnStyle, background: '#eee' }}>
                  Cancel
                </button>
                <button type="submit" style={{
                  background: '#845ef7',
                  color: '#fff',
                  border: 'none',
                  padding: '10px 20px',
                  borderRadius: '10px',
                  cursor: 'pointer'
                }}>
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

const btnStyle = {
  background: '#f7f7f7',
  border: '1px solid #ddd',
  borderRadius: '10px',
  padding: '10px 15px',
  cursor: 'pointer'
};

export default Leads;
