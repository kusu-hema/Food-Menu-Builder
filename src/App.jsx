import React, { useState } from 'react';
import MenuSelector from './Components/MenuSelector';
import MenuItems from './Components/MenuItems';
import PreviewDocument from './Components/PreviewDocument';
import menuData from './Data/Data';

function App() {
  const [category, setCategory] = useState('Tiffin');
  const [selectedItems, setSelectedItems] = useState([]);

  const handleAdd = (item) => {
    if (!selectedItems.includes(item)) {
      setSelectedItems([...selectedItems, item]);
    }
  };

  const handleRemove = (item) => {
    setSelectedItems(selectedItems.filter((i) => i !== item));
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      <div style={{ width: '50%', padding: '20px' }}>
        <MenuSelector selected={category} onSelect={setCategory} />
        <MenuItems
          items={menuData[category]}
          onAdd={handleAdd}
          selectedItems={selectedItems}
        />
      </div>
      <div style={{ width: '50%', padding: '20px', background: '#f9f9f9' }}>
        <PreviewDocument category={category} items={selectedItems} onRemove={handleRemove} />
      </div>
    </div>
  );
}

export default App;
