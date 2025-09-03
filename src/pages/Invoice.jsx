import React, { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import MenuSelector from '../Components/MenuSelector';
import MenuItems from '../Components/MenuItems';
import PreviewDocument from '../Components/PreviewDocument';

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

  const [menuContexts, setMenuContexts] = useState([
    { date: '', meal: '', members: '', items: {} }
  ]);

  const updateContext = (index, field, value) => {
    const updated = [...menuContexts];
    updated[index][field] = value;
    setMenuContexts(updated);
  };

  const handleAddItem = (index, category, itemName) => {
    const updated = [...menuContexts];
    const context = updated[index];
    const updatedItems = {
      ...context.items,
      [category]: [...(context.items[category] || []), itemName]
    };
    updated[index].items = updatedItems;
    setMenuContexts(updated);
  };

  const handleRemoveItem = (contextIndex, category, itemName) => {
    const updated = [...menuContexts];
    const filtered = updated[contextIndex].items[category].filter(i => i !== itemName);
    if (filtered.length === 0) {
      delete updated[contextIndex].items[category];
    } else {
      updated[contextIndex].items[category] = filtered;
    }
    setMenuContexts(updated);
  };

  const handleRemoveContext = (index) => {
    const updated = [...menuContexts];
    updated.splice(index, 1);
    setMenuContexts(updated);
  };

  const addMenuContext = () => {
    setMenuContexts([...menuContexts, { date: '', meal: '', members: '', items: {} }]);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Left Panel */}
        <div className="lg:w-2/5 bg-white rounded-lg shadow-md p-4">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Select Menu</h2>
          {menuContexts.map((context, index) => (
            <div key={index} className="mb-6 border rounded p-4 bg-white shadow">
              <MenuSelector
                context={context}
                onChange={(field, value) => updateContext(index, field, value)}
              />
              <MenuItems
                selectedItems={context.items}
                onAddItem={(category, itemName) => handleAddItem(index, category, itemName)}
              />
            </div>
          ))}
          <button
            onClick={addMenuContext}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            ➕ Add Menu Context
          </button>
        </div>

        {/* Right Panel */}
        <div className="lg:w-3/5 bg-white rounded-lg shadow-md p-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Invoice Preview</h2>
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
              menuContexts={menuContexts}
              onRemoveItem={handleRemoveItem}
              onRemoveContext={handleRemoveContext}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Invoice;