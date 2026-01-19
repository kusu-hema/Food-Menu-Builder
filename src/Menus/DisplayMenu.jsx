import React, { useEffect, useState, useRef } from "react";
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
  const previewRef = useRef(null);

  const [formData, setFormData] = useState({ name: "", contact: "", date: "", place: "" });
  const [menuContexts, setMenuContexts] = useState([{ date: "", meal: "", members: "", buffet: "", items: {} }]);
  const [invoiceData, setInvoiceData] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

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

  const handleRemoveContext = (index) => {
    if (!window.confirm("Are you sure you want to remove this menu context?")) return;
    setMenuContexts((prev) => {
      const copy = [...prev];
      copy.splice(index, 1);
      return copy.length ? copy : [{ date: "", meal: "", members: "", buffet: "", items: {} }];
    });
  };

  const addMenuContext = () =>
    setMenuContexts((prev) => [...prev, { date: "", meal: "", members: "", buffet: "", items: {} }]);

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  // convert Preview shape back into backend shape (categories array)
  const convertToBackend = () => {
    const backendContexts = menuContexts.map((ctx) => {
      const categoriesArr = Object.entries(ctx.items || {}).map(([category_name, items]) => ({
        category_name,
        items: Array.isArray(items) ? items : [],
      }));
      return {
        context_id: ctx.context_id || null,
        event_date: ctx.date,
        meal: ctx.meal,
        members: ctx.members,
        buffet: ctx.buffet,
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
        <div className="w-[480px] bg-white rounded-lg shadow p-4 max-h-[calc(100vh-3rem)] overflow-y-auto">
          <h2 className="text-xl font-semibold mb-4">Edit Menu</h2>

          <div className="mb-4">
            <label className="block text-sm font-semibold mb-1">Date</label>
            <input
              type="date"
              name="date"
              value={formData.date?.slice(0, 10) || ""}
              onChange={handleFormChange}
              className="w-full border rounded px-3 py-2 mb-3"
            />
            <label className="block text-sm font-semibold mb-1">Place</label>
            <input type="text" name="place" value={formData.place || ""} onChange={handleFormChange} className="w-full border rounded px-3 py-2 mb-3" />
            <label className="block text-sm font-semibold mb-1">Name</label>
            <input type="text" name="name" value={formData.name || ""} onChange={handleFormChange} className="w-full border rounded px-3 py-2 mb-3" />
            <label className="block text-sm font-semibold mb-1">Contact</label>
            <input type="text" name="contact" value={formData.contact || ""} onChange={handleFormChange} className="w-full border rounded px-3 py-2" />
          </div>

          <div>
            <h3 className="text-md font-semibold mb-2">Menu Contexts</h3>
            {menuContexts.map((ctx, idx) => (
              <div key={idx} className="mb-4 border rounded p-3">
                <div className="flex justify-between items-center mb-2">
                  <strong>{ctx.date || "No date"} - {ctx.meal || "No meal"}</strong>
                  <div className="space-x-2">
                    <button onClick={() => handleRemoveContext(idx)} className="px-2 py-1 bg-red-600 text-white rounded text-sm">
                      Remove
                    </button>
                  </div>
                </div>

                <MenuSelector context={ctx} onChange={(field, value) => updateContext(idx, field, value)} />

                <MenuItems selectedItems={ctx.items} onAddItem={(category, itemName) => handleAddItem(idx, category, itemName)} />

                {/* <div className="mt-2 text-sm">
                  <div className="font-semibold">Selected:</div>
                  <div className="flex flex-wrap gap-2 mt-2">
                    {Object.entries(ctx.items || {}).flatMap(([cat, items]) =>
                      (items || []).map((it) => (
                        <div key={cat + it} className="bg-gray-100 px-2 py-1 rounded flex items-center gap-2">
                          <span className="text-xs font-semibold">{cat}:</span>
                          <span className="text-xs">{it}</span>
                          <button onClick={() => handleRemoveItem(idx, cat, it)} className="ml-2 text-red-600 text-xs">x</button>
                        </div>
                      ))
                    )}
                  </div>
                </div> */}
              </div>
            ))}

            <div className="flex gap-2">
              <button onClick={addMenuContext} className="px-3 py-2 bg-green-600 text-white rounded">+ Add Context</button>
            </div>
          </div>

          <div className="mt-6">
            <button onClick={handleSaveAll} disabled={saving} className="px-4 py-2 bg-blue-600 text-white rounded mr-2">
              {saving ? "Saving..." : "Save Menu & Invoice"}
            </button>
            <button onClick={() => window.print()} className="px-4 py-2 border rounded">Print</button>
          </div>
        </div>

        {/* Right preview panel (exact Preview.js UI) */}
        <div className="flex-1 bg-white rounded-lg shadow p-4 overflow-auto max-h-[calc(100vh-3rem)]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Invoice Preview</h2>
            <div className="space-x-2">
              <button 
              onClick={() => window.print()} className="px-3 py-1 bg-indigo-600 text-white rounded">Print</button>
              <button onClick={() => navigate(-1)} className="px-3 py-1 border rounded">Back</button>
            </div>
          </div>

          <Preview
            ref={previewRef}
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
          />
        </div>
      </div>
    </div>
  );
};

export default EditMenuById;
