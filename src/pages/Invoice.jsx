import React, { useState, useEffect, useRef } from 'react';
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
      div { page-break-inside: avoid; }
    `,
  });

  // const [menuContexts, setMenuContexts] = useState([
  //   { date: '', meal: '', members: '', items: {} }
  // ]);

  // const [formData, setFormData] = useState({
  //   date: '',

  //   place: '',
  //   name: '',
  //   contact: '',
  // });

    const [menuContexts, setMenuContexts] = useState(() => {
    const saved = localStorage.getItem('menuContexts');
      return saved ? JSON.parse(saved) : [{ date: '', meal: '', members: '', items: {} }];
    });

    // const [formData, setFormData] = useState(() => {
    //   const saved = localStorage.getItem('formData');
    //   return saved ? JSON.parse(saved) : { date: '', place: '', name: '', contact: '' };
    // });

    useEffect(() => {
      localStorage.setItem('menuContexts', JSON.stringify(menuContexts));
    }, [menuContexts]);

    // useEffect(() => {
    //   localStorage.setItem('formData', JSON.stringify(formData));
    // }, [formData]);

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

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6 overflow-x-auto">
      <div className="flex flex-row gap-6 min-w-[1000px]">
        
        {/* Left Panel - Scrollable */}
        <div className="w-[400px] bg-white rounded-lg shadow-md p-4 overflow-y-auto max-h-[calc(100vh-3rem)]">
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

        {/* Right Panel - Scrollable */}
        <div className="flex-1 bg-white rounded-lg shadow-md p-4 overflow-y-auto max-h-[calc(100vh-3rem)]">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Invoice Preview</h2>
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              Print Invoice
            </button>
          </div>

          {/* Previewdocument file */}

          <div className="mt-4">
            <PreviewDocument
              ref={componentRef}
              menuContexts={menuContexts}
              onRemoveItem={handleRemoveItem}
              onRemoveContext={handleRemoveContext}
              // formData={formData}
              onFormChange={handleFormChange}
            />
          </div>

        </div>
      </div>
    </div>
  );
}

export default Invoice;