import React, { useState, useEffect, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import MenuSelector from '../MenuEdit/Selector';
import MenuItems from '../MenuEdit/Items';
import Preview from '../MenuEdit/Preview';

function Menu() {
  const componentRef = useRef(null);

  // Print setup
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: 'Invoice',
    pageStyle: `
      @page { margin: 5mm }
      body { font-family: Arial, sans-serif; }
      .invoice-section-container { page-break-before: always; }
      @media print {
        body {
              -webkit-print-color-adjust: exact;
          print-color-adjust: exact;
        }
      }
    `,
  });

  // States
  const [menuContexts, setMenuContexts] = useState(() => {
    const saved = localStorage.getItem('menuContexts');
    return saved
      ? JSON.parse(saved)
      : [{ date: '', meal: '', members: '', buffet: '', items: {} }];
  });

  const [formData, setFormData] = useState(() => {
    const saved = localStorage.getItem('formData');
    return saved
      ? JSON.parse(saved)
      : { date: '', place: '', name: '', contact: '' };
  });

  const [formExpanded, setFormExpanded] = useState(true);
  const [expandedIndex, setExpandedIndex] = useState(null);

  // Invoice state (will come from Preview component)
  const [invoiceData, setInvoiceData] = useState(null);

  // Local storage sync
  useEffect(() => {
    localStorage.setItem('menuContexts', JSON.stringify(menuContexts));
  }, [menuContexts]);

  useEffect(() => {
    localStorage.setItem('formData', JSON.stringify(formData));
  }, [formData]);

  // Helpers
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
    updated[index].items = {
      ...context.items,
      [category]: [...existingItems, itemName],
    };
    setMenuContexts(updated);
  };

  const handleRemoveItem = (contextIndex, category, itemName) => {
    const updated = [...menuContexts];
    const filtered = updated[contextIndex].items[category].filter(
      (i) => i !== itemName
    );
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
    setMenuContexts([
      ...menuContexts,
      { date: '', meal: '', members: '', buffet: '', items: {} },
    ]);
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const toggleAccordion = (index) => {
    setExpandedIndex((prev) => (prev === index ? null : index));
  };

  // -------------------------------
  // Backend Save Functions
  // -------------------------------
  const saveClientAndFullMenu = async () => {
    try {
      // 1️⃣ Save client (menu)
      const menuResponse = await fetch('http://localhost:4000/api/menus', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customer_name: formData.name,
          contact: formData.contact,
          place: formData.place,
          date: formData.date,
        }),
      });

      if (!menuResponse.ok) throw new Error('Failed to save client details');
      const menuData = await menuResponse.json();
      const menuId = menuData.id;
      console.log('✅ Menu saved:', menuData);

      // 2️⃣ Save each Menu Context
      for (const ctx of menuContexts) {
        const contextResponse = await fetch('http://localhost:4000/api/menucontext', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            menu_id: menuId,
            event_date: ctx.date,
            meal: ctx.meal,
            members: ctx.members,
            buffet: ctx.buffet,
            price: ctx.price,
            total: ctx.total
          }),
        });

        if (!contextResponse.ok) throw new Error('Failed to save menu context');
        const contextData = await contextResponse.json();
        const contextId = contextData.id;

        console.log('✅ Context saved:', contextData);

        // 3️⃣ Save Menu Items under this context
        for (const category of Object.keys(ctx.items)) {
          for (const itemName of ctx.items[category]) {
            await fetch('http://localhost:4000/api/menuitems', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({
                menu_context_id: contextId,
                category_name: category,
                item_name: itemName,
              }),
            });
          }
        }
      }

      alert('✅ All menu data saved successfully!');
      return menuId;
    } catch (error) {
      console.error('❌ Error saving menu data:', error);
      alert('Error saving menu data!');
      return null;
    }
  };

  // Save Invoice + Download PDF
  const saveInvoiceAndDownload = async (menuId) => {
    try {
      const response = await fetch('http://localhost:4000/api/menuinvoice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
        menu_id: menuId,
        subtotal: Number(invoiceData?.subtotal || 0),
        gst: Number(invoiceData?.gst || 0),
        grand_total: Number(invoiceData?.grand_total || 0),
        advance: Number(invoiceData?.advance || 0),
        balance: Number(invoiceData?.balance || 0),
        lead_counters: Number(invoiceData?.lead_counters || 0),
        water_bottles: Number(invoiceData?.water_bottles || 0),
        cooking_charges: Number(invoiceData?.cooking_charges || 0),
        labour_charges: Number(invoiceData?.labour_charges || 0),
        transport_charges: Number(invoiceData?.transport_charges || 0),
        price: Number(invoiceData?.price || 0),
        total: Number (invoiceData?.total || 0)

      }),
      });

      const data = await response.json();
      if (data.success && data.pdfUrl) {
        alert('✅ Invoice saved & PDF generated successfully!');

        // Auto download PDF
        const link = document.createElement('a');
        link.href = data.pdfUrl;
        link.download = `Invoice_${formData.name}.pdf`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      } else {
        alert('❌ Error saving invoice');
      }
    } catch (err) {
      console.error('❌ Error saving invoice:', err);
      alert('Server error, please check backend.');
    }
  };

  // Combined Save + Print + PDF
  const handleSavePrintDownload = async () => {
    const menuId = await saveClientAndFullMenu();
    if (menuId) {
      await saveInvoiceAndDownload(menuId);
      handlePrint();
    }
  };

  // -------------------------------
  // UI
  // -------------------------------
  return (
    <div className="min-h-screen bg-gray-100 p-6 overflow-x-auto">
      <div className="flex flex-row gap-6 min-w-[1000px]">
        {/* LEFT PANEL */}
        <div className="w-[500px] bg-white rounded-lg shadow-md p-4 overflow-y-auto max-h-[calc(100vh-3rem)]">
          <h2 className="text-lg font-semibold mb-4 text-gray-800">Select Menu</h2>

          {/* Customer Details */}
          <div
            className="flex justify-between items-center mb-2 cursor-pointer bg-gray-100 hover:bg-gray-200 px-3 py-2 rounded border"
            onClick={() => setFormExpanded((prev) => !prev)}
          >
            <h2 className="text-lg font-semibold text-gray-800">Customer Details</h2>
            <span className="text-sm text-blue-600">
              {formExpanded ? '▲ Collapse' : '▼ Expand'}
            </span>
          </div>

          {formExpanded && (
            <div className="mb-4">
              <label className="block text-sm font-semibold mb-1">Date</label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleFormChange}
                className="w-full border rounded px-3 py-2 text-sm mb-3"
              />
              <label className="block text-sm font-semibold mb-1">Place</label>
              <input
                type="text"
                name="place"
                value={formData.place}
                onChange={handleFormChange}
                className="w-full border rounded px-3 py-2 text-sm mb-3"
              />
              <label className="block text-sm font-semibold mb-1">Name</label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleFormChange}
                className="w-full border rounded px-3 py-2 text-sm mb-3"
              />
              <label className="block text-sm font-semibold mb-1">Contact</label>
              <input
                type="number"
                name="contact"
                value={formData.contact}
                onChange={handleFormChange}
                className="w-full border rounded px-3 py-2 text-sm"
              />
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
                    {context.date || 'Select Date'} - {context.meal || 'Meal'} -{' '}
                    {context.members || 'Members'}
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
                      onAddItem={(category, itemName) =>
                        handleAddItem(index, category, itemName)
                      }
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

        {/* RIGHT PANEL */}
        <div className="flex-1 bg-white rounded-lg shadow-md p-4 overflow-y-auto max-h-[calc(100vh-3rem)]">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-800">Invoice Preview</h2>
            <button
              onClick={handleSavePrintDownload}
              className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
            >
              💾 Save & Print Invoice
            </button>
          </div>
          
          {/* PREVIEW */}
          <div className="mt-4">
            <Preview
              ref={componentRef}
              menuContexts={menuContexts}
              onRemoveItem={handleRemoveItem}
              onRemoveContext={handleRemoveContext}
              formData={formData}
              onInvoiceDataChange={setInvoiceData} // 👈 Collect invoice totals from Preview
            />
          </div>


        </div>

      </div>
    </div>
  );
}

export default Menu;
