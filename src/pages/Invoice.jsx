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
      @page { margin: 5mm }
      body { font-family: Arial, sans-serif; }
      // webkit-print-color-adjust: exact;
      // print-color-adjust: exact;
      // @page { margin: 20mm 5mm 5mm 5mm }
      // div { page-break-inside: avoid; }
    `,
  });

  const [menuContexts, setMenuContexts] = useState(() => {
    const saved = localStorage.getItem('menuContexts');
    return saved ? JSON.parse(saved) : [{ date: '', meal: '', members: '', buffet: '', items: {} }];
  });

  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem('formData');
    return saved ? JSON.parse(saved) : { date: '', place: '', name: '', contact: '' };
  });

  useEffect(() => {
    localStorage.setItem('menuContexts', JSON.stringify(menuContexts));
  }, [menuContexts]);

  useEffect(() => {
    localStorage.setItem('formData', JSON.stringify(formData));
  }, [formData]);

  const updateContext = (index, field, value) => {
    const updated = [...menuContexts];
    updated[index][field] = value;
    setMenuContexts(updated);
  };

  const handleAddItem = (index, category, itemName) => {
    const updated = [...menuContexts];
    const context = updated[index];
    const existingItems = context.items[category] || [];
    if (existingItems.includes(itemName)) return;
    const updatedItems = {
      ...context.items,
      [category]: [...existingItems, itemName],
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
    setMenuContexts([...menuContexts, { date: '', meal: '', members: '', buffet: '', items: {} }]);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };


  const toggleAccordion = (index) => {
    setExpandedIndex(prev => (prev === index ? null : index));
  };

  const [formExpanded, setFormExpanded] = useState(true);
  const [expandedIndex, setExpandedIndex] = useState(null);

  return (
    <div className="min-h-screen bg-gray-100 p-6 overflow-x-auto">
      <div className="flex flex-row gap-6 min-w-[1000px]">

        {/* Left Panel */}
        <div className="w-[500px] bg-white rounded-lg shadow-md p-4 overflow-y-auto max-h-[calc(100vh-3rem)]">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Select Menu</h2>

          <div
            className="flex justify-between items-center mb-2 cursor-pointer bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded border"
            onClick={() => setFormExpanded(prev => !prev)}
          >
            <h2 className="text-lg font-semibold text-gray-800 ">Customer Details</h2>
            <span className="text-sm text-blue-600">
              {formExpanded ? '▲ Collapse' : '▼ Expand'}
            </span>
          </div>

          {/* Form Inputs */}
          {formExpanded && (
            <div className="mb-4 ">
              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-800 mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleFormChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-800 mb-1">Place</label>
                <input
                  type="text"
                  name="place"
                  value={formData.place}
                  onChange={handleFormChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  placeholder="Enter place"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-800 mb-1">Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleFormChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  placeholder="Enter name"
                />
              </div>

              <div className="mb-4">
                <label className="block text-sm font-semibold text-gray-800 mb-1">Contact</label>
                <input
                  type="number"
                  name="contact"
                  value={formData.contact}
                  onChange={handleFormChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 text-sm"
                  placeholder="Enter contact number"
                />
              </div>
            </div>
          )}

          {/* Menu Contexts */}
          {menuContexts.map((context, index) => {
            const isOpen = expandedIndex === index;
            return (
              <div key={index} className="mb-4 border rounded bg-white shadow">
                <div
                  className="flex justify-between items-center p-3 cursor-pointer bg-gray-100 hover:bg-gray-200"
                  onClick={() => toggleAccordion(index)}
                >
                  <div className="font-semibold text-gray-800">
                    {context.date || 'Select Date'} - {context.meal || 'Meal'} - {context.members || 'Members'}
                  </div>
                  <div className="text-sm text-blue-600">
                    {isOpen ? '▲ Collapse' : '▼ Expand'}
                  </div>
                </div>

                {isOpen && (
                  <div className="p-4 border-t">
                    <MenuSelector
                      context={context}
                      onChange={(field, value) => updateContext(index, field, value)}
                    />
                    <MenuItems
                      selectedItems={context.items}
                      onAddItem={(category, itemName) => handleAddItem(index, category, itemName)}
                    />
                  </div>
                )}
              </div>
            );
          })}

          <button
            onClick={addMenuContext}
            className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition"
          >
            ➕ Add Menu Context
          </button>
        </div>

        {/* Right Panel */}
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

          <div className="mt-4">
            <PreviewDocument
              ref={componentRef}
              menuContexts={menuContexts}
              onRemoveItem={handleRemoveItem}
              onRemoveContext={handleRemoveContext}
              formData={formData}
              onFormChange={handleFormChange}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default Invoice;