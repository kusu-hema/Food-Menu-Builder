import React, { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

// internal pages
import PreviewDocument from './Components/PreviewDocument';
import MenuSelector from './Components/MenuSelector';
import MenuItems from './Components/MenuItems';
import menuData from './Data/Data';


function App() {
  const componentRef = useRef(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: 'Invoice',
    pageStyle: `
      @page { margin: 20mm }
      body { font-family: Arial, sans-serif; }
    `,
  });

  const [category, setCategory] = useState('Tiffin');
  const [selectedItems, setSelectedItems] = useState({
    Tiffin: [],
    Lunch: [],
    Dinner: [],
  });

  const handleAdd = (item) => {
    if (!selectedItems[category].includes(item)) {
      setSelectedItems({
        ...selectedItems,
        [category]: [...selectedItems[category], item],
      });
    }
  };

  const handleRemove = (category, item) => {
    setSelectedItems((prev) => ({
      ...prev,
      [category]: prev[category].filter((i) => i !== item),
    }));
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      
      <div style={{ width: '40%', padding: '20px' }}>
        <MenuSelector selected={category} onSelect={setCategory} />
        <MenuItems
          items={menuData[category]}
          onAdd={handleAdd}
          selectedItems={selectedItems[category]}
        />
      </div>

      <div style={{ width: '60%', padding: '20px', background: '#f9f9f9' }}>
        <button onClick={handlePrint}>Print Invoice</button>

        <div style={{ marginTop: '20px' }}>
          <PreviewDocument
            ref={componentRef}
            selectedItems={selectedItems}
            onRemove={handleRemove}
          />
        </div>
      </div>

    </div>
  );
}

export default App;



 
 
