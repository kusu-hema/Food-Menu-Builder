// PreviewDocument.jsx
import React from 'react';
import '../App.css'

const styles = {
  container: {
    border: '1px solid #ccc',
    borderRadius: '10px',
    padding: '30px',
    maxWidth: '1000px',
    margin: 'auto',
    backgroundColor: '#fdfdfd',
    fontFamily: 'Segoe UI, sans-serif',
    color: '#111',
    boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
  },
  centerText: {
    textAlign: 'center',
    margin: '8px 0',
    textTransform: 'uppercase',
    fontWeight: 'bold'
  },
  subHeader: {
    fontSize: '14px',
    color: '#444',
    margin: '4px 0',
    textAlign: 'center'
  },
  infoRow: {
    display: 'flex',
    justifyContent: 'space-between',
    flexWrap: 'wrap',
    marginTop: '20px',
    marginBottom: '10px',
    fontSize: '15px'
  },
  categoryTitle: {
    marginTop: '20px',
    fontWeight: 'bold',
    fontSize: '18px',
    borderBottom: '1px solid #ddd',
    paddingBottom: '5px',
    color: '#222'
  },
  itemsText: {
    lineHeight: '2em',
    fontSize: '16px',
    display: 'flex',
    flexWrap: 'wrap'
  },
  itemSpan: {
    marginRight: '20px',
    marginBottom: '10px',
    display: 'inline-flex',
    alignItems: 'center'
  },
  removeButton: {
    marginLeft: '8px',
    background: '#fff',
    border: '1px solid #ddd',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '14px',
    color: '#d00',
    padding: '2px 6px',
    transition: '0.3s'
  },
  noItemsText: {
    fontStyle: 'italic',
    color: '#aaa'
  }
};

const PreviewDocument = React.forwardRef(({ selectedItems, onRemove }, ref) => (
  <div ref={ref} style={styles.container}>
    <h2 style={styles.centerText}>SHANMUKHA CATERERS PVT. LTD</h2>
    <h4 style={styles.subHeader}>
      An ISO 22000:2018 CERTIFIED COMPANY |{' '}
      <a href="https://www.shanmukhacaterers.co.in/" target="_blank" rel="noreferrer">
        www.shanmukhacaterers.co.in
      </a>
    </h4>
    <h4 style={styles.subHeader}>VIDYA NAGAR, HYDERABAD - 500 044 | CUSTOMER CARE: 1800 8903781</h4>
    <h3 style={styles.centerText}>WE CATER TO YOUR HEALTH</h3>

    <div style={styles.infoRow}>
      <p><strong>DATE:</strong> 22.06.2025</p>
      <p><strong>PLACE:</strong> Vidya Nagar</p>
    </div>

    <div style={{ marginBottom: '10px', fontSize: '15px' }}>
      <p><strong>NAME:</strong> Anu</p>
      <p><strong>CONTACT:</strong> +91 82973 25543</p>
      <p><strong>FOR:</strong> 100 MEMBERS</p>
    </div>

    {['Tiffin', 'Lunch', 'Dinner'].map((category) => (
      <div key={category}>
        <div style={styles.categoryTitle}>{category.toUpperCase()}</div>
        {selectedItems[category].length === 0 ? (
          <p style={styles.noItemsText}>No items selected.</p>
        ) : (
          <div style={styles.itemsText}>
            {selectedItems[category].map((item) => (
              <span key={item} style={styles.itemSpan}>
                * {item}
                <button
                  onClick={() => onRemove(category, item)}
                  style={styles.removeButton}
                  title="Remove item"
                >
                  ❌
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    ))}
  </div>
));

export default PreviewDocument;
