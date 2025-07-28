import React, { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

import PreviewDocument from '../Components/PreviewDocument';
import MenuSelector from '../Components/MenuSelector';
import MenuItems from '../Components/MenuItems';
import menuData from '../Data/Data';

function Invoice() {
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
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-10">
      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Left Panel */}
        <div className="lg:w-2/5 bg-white rounded-lg shadow-md p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold mb-4 text-gray-800">Select Menu</h2>
          <MenuSelector selected={category} onSelect={setCategory} />
          <div className="mt-4">
            <MenuItems
              items={menuData[category]}
              onAdd={handleAdd}
              selectedItems={selectedItems[category]}
            />
          </div>
        </div>

        {/* Right Panel */}
        <div className="lg:w-3/5 bg-white rounded-lg shadow-md p-4 sm:p-6">
          <div className="flex justify-between items-center">
            <h2 className="text-lg sm:text-xl font-semibold text-gray-800"> Invoice Preview</h2>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Print Invoice
            </button>
          </div>
          <div className="mt-4">
            <PreviewDocument
              ref={componentRef}
              selectedItems={selectedItems}
              onRemove={handleRemove}
            />
          </div>
        </div>

      </div>
    </div>
  );
}

export default Invoice;
