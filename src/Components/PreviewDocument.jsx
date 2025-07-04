function PreviewDocument({ category, items, onRemove }) {
    return (
      <div style={{ border: '1px solid #ddd', padding: '20px', minHeight: '100%' }}>
        <h3 style={{ textAlign: 'center' }}>{category.toUpperCase()} MENU</h3>
        <p><strong>DATE:</strong> 22.06.2025</p>
        <p><strong>CONTACT:</strong> +91 82973 25543</p>
        <p><strong>FOR 100 MEMBERS</strong></p>
        <h4>Items:</h4>
        <ul>
          {items.map((item) => (
            <li key={item}>
              {item} <button onClick={() => onRemove(item)} style={{ marginLeft: '10px' }}>❌</button>
            </li>
          ))}
        </ul>
      </div>
    );
  }
  
  export default PreviewDocument;
  