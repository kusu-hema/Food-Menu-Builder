function PreviewDocument({ selectedItems, onRemove }) {
  return (
    <div style={{ border: '1px solid #ddd', padding: '20px', minHeight: '100%' }}>
      <h3 style={{ textAlign: 'center' }}>SHANMUKHA CATERERS PVT.LTD</h3>
      <h3 style={{ textAlign: 'center' }}>WE CATER TO YOUR HEALTH</h3>

      {/* <h3 style={{ textAlign: 'center' }}>CATERING MENU</h3> */}
      <p><strong>DATE:</strong> 22.06.2025</p>
      <p><strong>PLACE:</strong>Vidya Nagar</p>

      <p><strong>NAME:</strong>Anu </p>
      <p><strong>CONTACT:</strong> +91 82973 25543</p>
      {/* <p><strong>CONTACT:</strong> +91 82973 25543</p> */}
      <p><strong>FOR 100 MEMBERS</strong></p>

      {['Tiffin', 'Lunch', 'Dinner'].map((category) => (
        <div key={category} style={{ marginTop: '20px' }}>
          <h4>{category.toUpperCase()}</h4>
          {selectedItems[category].length === 0 ? (
            <p style={{ fontStyle: 'italic', color: '#888' }}>No items selected.</p>
          ) : (
            <ul>
              {selectedItems[category].map((item) => (
                <li key={item}>
                  {item}
                  <button
                    onClick={() => onRemove(category, item)}
                    style={{ marginLeft: '10px' }}
                  >
                    ❌
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ))}
    </div>
  );
}

export default PreviewDocument;
