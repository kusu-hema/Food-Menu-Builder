// PreviewDocument.jsx
import React from 'react';

const PreviewDocument = React.forwardRef(({ selectedItems, onRemove }, ref) => (
  <div ref={ref} style={{ border: '1px solid #ddd', padding: '20px', minHeight: '100%' }}>
    <h3 style={{ textAlign: 'center' }}>SHANMUKHA CATERERS PVT.LTD</h3>
    <h6 style={{ textAlign: 'center' }}>
      An ISO 22000:2018 CERTIFIED COMPANY, Visit:{' '}
      <a href="https://www.shanmukhacaterers.co.in/" target="_blank" rel="noreferrer">
        WWW.SHANMUKHACATERERS.CO.IN
      </a>
    </h6>
    <h5 style={{ textAlign: 'center' }}>
      VIDYA NAGAR, HYDERABAD -500 044, CUSTOMER CARE:1800 8903781
    </h5>
    <h3 style={{ textAlign: 'center' }}>WE CATER TO YOUR HEALTH</h3>

    <p><strong>DATE:</strong> 22.06.2025</p>
    <p><strong>PLACE:</strong> Vidya Nagar</p>
    <p><strong>NAME:</strong> Anu</p>
    <p><strong>CONTACT:</strong> +91 82973 25543</p>
    <p><strong>FOR 100 MEMBERS</strong></p>

    {['Tiffin', 'Lunch', 'Dinner'].map((category) => (
      <div key={category} style={{ marginTop: '20px' }}>
        <h4>{category.toUpperCase()}</h4>
        {selectedItems[category].length === 0 ? (
          <p style={{ fontStyle: 'italic', color: '#888' }}>No items selected.</p>
        ) : (
          <p style={{ lineHeight: '2em' }}>
            {selectedItems[category].map((item) => (
              <span key={item} style={{ marginRight: '15px' }}>
                * {item}
                <button
                  onClick={() => onRemove(category, item)}
                  style={{
                    marginLeft: '5px',
                    background: 'transparent',
                    border: 'none',
                    cursor: 'pointer',
                    color: 'red'
                  }}
                >
                  ❌
                </button>
              </span>
            ))}
          </p>
        )}
      </div>
    ))}
  </div>
));

export default PreviewDocument;
