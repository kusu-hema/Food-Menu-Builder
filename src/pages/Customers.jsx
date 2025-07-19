import React from 'react';

const  Customers = () => {
  const styles = {
    container: {
      padding: '30px',
      fontFamily: 'Inter, sans-serif',
      background: '#f6f7fb',
      minHeight: '100vh',
      color: '#222'
    },
    header: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      flexWrap: 'wrap'
    },
    searchBox: {
      padding: '10px',
      border: '1px solid #ddd',
      borderRadius: '12px',
      width: '200px',
      marginTop: '10px'
    },
    overviewGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
      gap: '20px',
      marginTop: '30px'
    },
    card: {
      background: 'white',
      padding: '20px',
      borderRadius: '16px',
      boxShadow: '0 5px 15px rgba(0,0,0,0.05)'
    },
    sectionTitle: {
      marginTop: '40px',
      marginBottom: '10px'
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginTop: '10px'
    },
    thtd: {
      padding: '10px',
      fontSize: '14px',
      textAlign: 'left',
      borderBottom: '1px solid #eee'
    },
    status: {
      background: '#00c897',
      color: 'white',
      padding: '3px 8px',
      borderRadius: '6px',
      fontSize: '12px'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h2>Hello Shanmukha 👋🏼</h2>
        <input type="text" placeholder="Search" style={styles.searchBox} />
      </div>

      <div style={styles.overviewGrid}>
        <div style={styles.card}>
          <h4>Total Orders</h4>
          <p>124</p>
        </div>
        <div style={styles.card}>
          <h4>Upcoming Events</h4>
          <p>8</p>
        </div>
        <div style={styles.card}>
          <h4>Total Customers</h4>
          <p>256</p>
        </div>
        <div style={styles.card}>
          <h4>Today’s Bookings</h4>
          <p>5</p>
        </div>
      </div>

      <h3 style={styles.sectionTitle}>Upcoming Events</h3>
      <div style={styles.card}>
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
            <tr>
              <td style={styles.thtd}>1.</td>
              <td style={styles.thtd}>Ramya</td>
              <td style={styles.thtd}>9848XXXXXXXX</td>
              <td style={styles.thtd}>July 16</td>
              <td style={styles.thtd}>July 17</td>
              <td style={styles.thtd}>Marriage</td>
              <td style={styles.thtd}>Hyderabad</td>
              <td style={styles.thtd}><span style={styles.status}>New</span></td>
              <td style={styles.thtd}>Edit | Share</td>
            </tr>

            <tr>
              <td style={styles.thtd}>2.</td>
              <td style={styles.thtd}>lavanya</td>
              <td style={styles.thtd}>9848XXXXXXXX</td>
              <td style={styles.thtd}>July 16</td>
              <td style={styles.thtd}>July 17</td>
              <td style={styles.thtd}>Marriage</td>
              <td style={styles.thtd}>Hyderabad</td>
              <td style={styles.thtd}><span style={styles.status}>New</span></td>
              <td style={styles.thtd}>Edit | Share</td>
            </tr>

            <tr>
              <td style={styles.thtd}>3.</td>
              <td style={styles.thtd}>sita</td>
              <td style={styles.thtd}>9848XXXXXXXX</td>
              <td style={styles.thtd}>July 16</td>
              <td style={styles.thtd}>July 17</td>
              <td style={styles.thtd}>Marriage</td>
              <td style={styles.thtd}>Hyderabad</td>
              <td style={styles.thtd}><span style={styles.status}>New</span></td>
              <td style={styles.thtd}>Edit | Share</td>
            </tr>

            <tr>
              <td style={styles.thtd}>4.</td>
              <td style={styles.thtd}>Ramya</td>
              <td style={styles.thtd}>9848XXXXXXXX</td>
              <td style={styles.thtd}>July 16</td>
              <td style={styles.thtd}>July 17</td>
              <td style={styles.thtd}>Marriage</td>
              <td style={styles.thtd}>Hyderabad</td>
              <td style={styles.thtd}><span style={styles.status}>New</span></td>
              <td style={styles.thtd}>Edit | Share</td>
            </tr>

            <tr>
              <td style={styles.thtd}>5.</td>
              <td style={styles.thtd}>Ramya</td>
              <td style={styles.thtd}>9848XXXXXXXX</td>
              <td style={styles.thtd}>July 16</td>
              <td style={styles.thtd}>July 17</td>
              <td style={styles.thtd}>Marriage</td>
              <td style={styles.thtd}>Hyderabad</td>
              <td style={styles.thtd}><span style={styles.status}>New</span></td>
              <td style={styles.thtd}>Edit | Share</td>
            </tr>

            <tr>
              <td style={styles.thtd}>6.</td>
              <td style={styles.thtd}>Ramya</td>
              <td style={styles.thtd}>9848XXXXXXXX</td>
              <td style={styles.thtd}>July 16</td>
              <td style={styles.thtd}>July 17</td>
              <td style={styles.thtd}>Marriage</td>
              <td style={styles.thtd}>Hyderabad</td>
              <td style={styles.thtd}><span style={styles.status}>New</span></td>
              <td style={styles.thtd}>Edit | Share</td>
            </tr>

            <tr>
              <td style={styles.thtd}>7.</td>
              <td style={styles.thtd}>Ramya</td>
              <td style={styles.thtd}>9848XXXXXXXX</td>
              <td style={styles.thtd}>July 16</td>
              <td style={styles.thtd}>July 17</td>
              <td style={styles.thtd}>Marriage</td>
              <td style={styles.thtd}>Hyderabad</td>
              <td style={styles.thtd}><span style={styles.status}>New</span></td>
              <td style={styles.thtd}>Edit | Share</td>
            </tr>

            <tr>
              <td style={styles.thtd}>8.</td>
              <td style={styles.thtd}>Ramya</td>
              <td style={styles.thtd}>9848XXXXXXXX</td>
              <td style={styles.thtd}>July 16</td>
              <td style={styles.thtd}>July 17</td>
              <td style={styles.thtd}>Marriage</td>
              <td style={styles.thtd}>Hyderabad</td>
              <td style={styles.thtd}><span style={styles.status}>New</span></td>
              <td style={styles.thtd}>Edit | Share</td>
            </tr>

          </tbody>
        </table>
      </div>

      <h3 style={styles.sectionTitle}>Customers</h3>
      <div style={styles.card}>
        <p>Customer list or stats will be displayed here.</p>
      </div>

      <h3 style={styles.sectionTitle}>Last Section</h3>
      <div style={styles.card}>
        <p>Additional information or footer widgets go here.</p>
      </div>
    </div>
  );
};

export default  Customers;
