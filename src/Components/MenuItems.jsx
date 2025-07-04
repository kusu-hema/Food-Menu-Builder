function MenuItems({ items, onAdd, selectedItems }) {
    return (
      <div>
        <h3>Available Items</h3>
        {items.map((item) => (
          <div
            key={item}
            onClick={() => onAdd(item)}
            style={{
              border: '1px solid #ccc',
              padding: '10px',
              marginBottom: '5px',
              cursor: 'pointer',
              background: selectedItems.includes(item) ? '#e0ffe0' : '#fff'
            }}
          >
            ➕ {item}
          </div>
        ))}
      </div>
    );
  }
  
  export default MenuItems;
  