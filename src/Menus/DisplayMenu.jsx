import React, { useEffect, useState, useRef } from "react";
import { useReactToPrint } from 'react-to-print';
import { useParams, useNavigate } from "react-router-dom";
import MenuSelector from "../MenuEdit/Selector";
import MenuItems from "../MenuEdit/Items";
import Preview from "../MenuEdit/Preview";

/** 
 * EditMenuById.js 
 *
 * - Loads menu by id using GET http://localhost:4000/api/menus/details/${id}
 * - Lets user edit using the same Preview.js UI pattern
 * - On Save:
 *    * tries PUT http://localhost:4000/api/menus/${id}
 *    * if PUT fails (404 or server error), falls back to POST http://localhost:4000/api/menus (create new)
 * - No external endpoints file; URLs are inline as requested
 * - Converts backend menu_contexts (categories[]) -> Preview format (items:{})
 */

const EditMenuById = () => {  
  const { id } = useParams();
  const navigate = useNavigate();
  // const previewRef = useRef(null);

  const [formData, setFormData] = useState({ name: "", contact: "", date: "", place: "" });
  const [menuContexts, setMenuContexts] = useState([{ date: "", meal: "", members: "", buffet: "", items: {} }]);
  const [invoiceData, setInvoiceData] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);


  // Toggle Accordian 
  const [formExpanded, setFormExpanded] = useState(true);
  const [expandedIndex, setExpandedIndex] = useState(null);
  
  // Toggle Accordian 
  const toggleAccordion = (index) => {
  setExpandedIndex((prev) => (prev === index ? null : index));
  };
  
  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: 'Menu',
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

  // ---- Load detail by ID and convert backend -> Preview format
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetch(`http://localhost:4000/api/menus/details/${id}`)
      .then(async (res) => {
        if (!res.ok) {
          const txt = await res.text().catch(() => "");
          throw new Error(`Failed to fetch menu: ${res.status} ${txt}`);
        }
        return res.json();
      })
      .then((data) => {
        if (cancelled) return;

        setFormData({
          name: data.customer_name || "",
          contact: data.contact || "",
          date: data.booking_date || data.date || "",
          place: data.place || "",
        });

        const contexts = (data.menu_contexts || []).map((ctx) => {
          const itemsObj = {};
          if (Array.isArray(ctx.categories)) {
            ctx.categories.forEach((cat) => {
              const key = cat.category_name || "UNNAMED";
              itemsObj[key] = Array.isArray(cat.items) ? [...cat.items] : [];
            });
          }
          return {
            date: ctx.event_date || ctx.date || "",
            meal: ctx.meal || "",
            members: ctx.members || 0,
            buffet: ctx.buffet === true || ctx.buffet === "true" ? "YES" : String(ctx.buffet || ""),
            items: itemsObj,
            context_id: ctx.context_id || ctx.id || null,
            // price: ctx.price || 0, 
            // total: ctx.total || 0,
            
            price: Number(ctx.price) || 0, 
            total: Number(ctx.total) || 0,

          };
        });

        setMenuContexts(contexts.length ? contexts : [{ date: "", meal: "", members: "", buffet: "", items: {} }]);

        setInvoiceData({
          subtotal: Number(data.subtotal || 0),
          gst: Number(data.gst || 0),
          grand_total: Number(data.grand_total || data.totalAmount || 0),
          advance: Number(data.advance || 0),
          balance: Number(data.balance || 0),
          lead_counters: Number(data.lead_counters || 0),
          water_bottles: Number(data.water_bottles || 0),
          cooking_charges: Number(data.cooking_charges || 0),
          labour_charges: Number(data.labour_charges || 0),
          transport_charges: Number(data.transport_charges || 0),
        });

        setError(null);
      })
      .catch((err) => {
        console.error("Fetch detail error:", err);
        if (!cancelled) setError(err.message || "Failed to load details");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  // ---- helpers to update UI state
  const updateContext = (index, field, value) => {
    setMenuContexts((prev) => {
      const copy = [...prev];
      copy[index] = { ...copy[index], [field]: value };
      return copy;
    });
  };

  //  Add Category & item  
  const handleAddItem = (index, category, itemName) => {
    setMenuContexts((prev) => {
      const copy = [...prev];
      const ctx = { ...copy[index] };
      const existing = Array.isArray(ctx.items?.[category]) ? ctx.items[category] : [];
      if (!existing.includes(itemName)) {
        ctx.items = { ...ctx.items, [category]: [...existing, itemName] };
        copy[index] = ctx;
      }
      return copy;
    });
  };
  
  // handle Remove Item 
  const handleRemoveItem = (ctxIndex, category, itemName) => {
    setMenuContexts((prev) => {
      const copy = [...prev];
      const items = Array.isArray(copy[ctxIndex].items[category]) ? copy[ctxIndex].items[category] : [];
      const filtered = items.filter((it) => it !== itemName);
      if (filtered.length === 0) {
        const { [category]: _, ...rest } = copy[ctxIndex].items;
        copy[ctxIndex].items = rest;
      } else {
        copy[ctxIndex].items[category] = filtered;
      }
      return copy;
    });
  };

  // handle Remove context
  const handleRemoveContext = (index) => {
    if (!window.confirm("Are you sure you want to remove this menu context?")) return;
    setMenuContexts((prev) => {
      const copy = [...prev];
      copy.splice(index, 1);
      return copy.length ? copy : [{ date: "", meal: "", members: "", buffet: "", items: {} }];
    });
  };

  // Add Menu context 
  const addMenuContext = () =>
    setMenuContexts((prev) => [...prev, { date: "", meal: "", members: "", buffet: "", items: {} }]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };


  // Inside EditMenuById.js return statement:
{loading ? (
  <div className="flex-1 flex items-center justify-center">
    <p className="text-xl font-bold">Loading Menu Data...</p>
  </div>
) : (
  <Preview
    ref={componentRef}
    menuContexts={menuContexts}
    onRemoveItem={handleRemoveItem}
    onRemoveContext={handleRemoveContext}
    // IMPORTANT: Make sure these fields are passed into formData
    formData={{
      ...formData,
      gst: invoiceData?.gst,
      advance: invoiceData?.advance,
      lead_counters: invoiceData?.lead_counters,
      water_bottles: invoiceData?.water_bottles,
      cooking_charges: invoiceData?.cooking_charges,
      labour_charges: invoiceData?.labour_charges,
      transport_charges: invoiceData?.transport_charges,
    }}
    onInvoiceDataChange={setInvoiceData}
  />
)}

  // convert Preview shape back into backend shape (categories array)
  const convertToBackend = () => {
    const backendContexts = menuContexts.map((ctx, index) => {
      const categoriesArr = Object.entries(ctx.items || {}).map(([category_name, items]) => ({
        category_name,
        items: Array.isArray(items) ? items : [],
      }));
      const rowPriceTotal = invoiceData?.rows?.[index] || { 
      price: ctx.price || 0, 
      total: ctx.total || 0 
    };
      return {
        context_id: ctx.context_id || null,
        event_date: ctx.date,
        meal: ctx.meal,
        members: ctx.members,
        buffet: ctx.buffet,
        price: Number(rowPriceTotal.price) || 0,
        total: Number(rowPriceTotal.total) || 0,
        categories: categoriesArr,
      };
    });

    return {
      customer_name: formData.name,
      contact: formData.contact,
      place: formData.place,
      booking_date: formData.date,
      menu_contexts: backendContexts,
      ...(invoiceData || {}),
    };
  };

  // ---- Save flow:
  // Try PUT /api/menus/:id; if it fails (404 or server returns no ok),
  // fallback to POST /api/menus to create a new menu.
  const handleSaveAll = async () => {
    try {
      setSaving(true);
      const payload = convertToBackend();

      // Try PUT to update (common case)
      try {
        const putRes = await fetch(`http://localhost:4000/api/menus/${id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        if (putRes.ok) {
          const json = await putRes.json().catch(() => null);
          alert("✅ Menu & Invoice updated successfully (PUT).");
          return;
        }

        // If PUT returned 404 or not ok, we'll fall back
        console.warn("PUT failed, will try POST. PUT status:", putRes.status);
      } catch (putErr) {
        console.warn("PUT request error, will try POST:", putErr);
      }

      // Fallback: POST to create new menu
      const postRes = await fetch("http://localhost:4000/api/menus", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!postRes.ok) {
        const txt = await postRes.text().catch(() => "");
        throw new Error(`Create failed: ${postRes.status} ${txt}`);
      }

      const created = await postRes.json().catch(() => null);
      const createdId = created?.id || created?.menu_id || null;
      alert(`✅ No update API found. Created new menu ${createdId ? `with id ${createdId}` : ""}.`);
      // optionally navigate to new id page
      if (createdId) {
        navigate(`/menu/edit/${createdId}`);
      }
    } catch (err) {
      console.error("Save error:", err);
      alert("❌ Failed to save. See console for details.");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="p-6">Loading menu...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="flex gap-6 min-w-[1000px]">
        
        {/* Left editor panel */}
          <div className="w-[500px] bg-white rounded-lg shadow-md p-4 overflow-y-auto max-h-[calc(100vh-3rem)]">
            <h2 className="text-lg font-semibold mb-4 text-gray-800">Edit Menu</h2>

            {/* Customer Details Accordion */}
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
              <div className="mb-4 p-2">
                <label className="block text-sm font-semibold mb-1">Date</label>
                <input
                  type="date"
                  name="date"
                  value={formData.date?.slice(0, 10) || ""}
                  onChange={handleFormChange}
                  className="w-full border rounded px-3 py-2 text-sm mb-3"
                />
                <label className="block text-sm font-semibold mb-1">Place</label>
                <input type="text" name="place" value={formData.place || ""} onChange={handleFormChange} className="w-full border rounded px-3 py-2 text-sm mb-3" />
                <label className="block text-sm font-semibold mb-1">Name</label>
                <input type="text" name="name" value={formData.name || ""} onChange={handleFormChange} className="w-full border rounded px-3 py-2 text-sm mb-3" />
                <label className="block text-sm font-semibold mb-1">Contact</label>
                <input type="text" name="contact" value={formData.contact || ""} onChange={handleFormChange} className="w-full border rounded px-3 py-2 text-sm" />
              </div>
            )}

            {/* Menu Contexts Accordion */}
            <h3 className="text-md font-semibold mb-2 mt-4 text-gray-800">Menu Contexts</h3>
            
            {menuContexts.map((ctx, idx) => {
              const isOpen = expandedIndex === idx;
              return (
                <div key={idx} className="mb-4 border rounded bg-white shadow">
                  <div
                    className="flex justify-between items-center p-3 cursor-pointer bg-gray-100 hover:bg-gray-200"
                    onClick={() => toggleAccordion(idx)}
                  >
                    <div className="font-semibold text-gray-800">
                      {ctx.date || 'Select Date'} - {ctx.meal || 'Meal'} - {ctx.members || '0'}
                    </div>
                    <div className="text-sm text-blue-600">
                      {isOpen ? '▲ Collapse' : '▼ Expand'}
                    </div>
                  </div>

                  {isOpen && (
                    <div className="p-4 border-t">
                      <div className="flex justify-end mb-2">
                        <button 
                          onClick={(e) => { e.stopPropagation(); handleRemoveContext(idx); }} 
                          className="text-xs text-red-600 hover:underline"
                        >
                          Delete Context
                        </button>
                      </div>
                      <MenuSelector 
                        context={ctx} 
                        onChange={(field, value) => updateContext(idx, field, value)} 
                      />
                      <MenuItems 
                        selectedItems={ctx.items} 
                        onAddItem={(category, itemName) => handleAddItem(idx, category, itemName)} 
                      />
                    </div>
                  )}
                </div>
              );
            })}

            <button
              onClick={addMenuContext}
              className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition w-full mb-6"
            >
              ➕ Add Menu Context
            </button>

            <div className="bottom-0 bg-white pt-4 border-t flex gap-2">
              <button onClick={handleSaveAll} disabled={saving} className="flex-1 px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700">
                {saving ? "Saving..." : "💾 Save Changes"}
              </button>
            </div>
          </div>

        {/* Right preview panel (exact Preview.js UI) */}
        <div className="flex-1 bg-white rounded-lg shadow p-4 overflow-auto max-h-[calc(100vh-3rem)]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Invoice Preview</h2>
            <div className="space-x-2">
              <button 
              onClick={handlePrint} className="px-3 py-1 bg-indigo-600 text-white rounded">Print
              </button>

              {/*<button 
              onClick={() => window.print()} className="px-3 py-1 bg-indigo-600 text-white rounded">Print
              </button>*/}

              <button onClick={() => navigate(-1)} className="px-3 py-1 border rounded">Back</button>
            </div>
          </div>

          {/* <Preview
            ref={componentRef}
            // ref={previewRef}
            menuContexts={menuContexts}
            onRemoveItem={handleRemoveItem}
            onRemoveContext={handleRemoveContext}
            formData={{
              name: formData.name,
              contact: formData.contact,
              date: formData.date,
              place: formData.place,
            }}
            onInvoiceDataChange={setInvoiceData}
          /> */}

          {loading ? (
  <p>Loading Data...</p>
) : (


          <Preview
            ref={componentRef}
            menuContexts={menuContexts}
            onRemoveItem={handleRemoveItem}
            onRemoveContext={handleRemoveContext}
            // Expand formData to include the invoice fields
            formData={{
              ...formData,
              gst: invoiceData?.gst,
              advance: invoiceData?.advance,
              lead_counters: invoiceData?.lead_counters,
              water_bottles: invoiceData?.water_bottles,
              cooking_charges: invoiceData?.cooking_charges,
              labour_charges: invoiceData?.labour_charges,
              transport_charges: invoiceData?.transport_charges,
            }}
            onInvoiceDataChange={setInvoiceData}
          />
          )}
        </div>

      </div>
    </div>
  );
};

  

export default EditMenuById;