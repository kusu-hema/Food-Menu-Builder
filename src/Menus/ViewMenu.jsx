import React, { useEffect, useState, useRef } from "react";
import { useReactToPrint } from 'react-to-print';
import { useParams, useNavigate } from "react-router-dom";
import Preview from "../MenuEdit/Preview";


 
const ViewMenu = () => { 
  const { id } = useParams();
  const navigate = useNavigate();
  // const previewRef = useRef(null);

  const [formData, setFormData] = useState({ name: "", contact: "", date: "", place: "" });
  const [menuContexts, setMenuContexts] = useState([{ date: "", meal: "", members: "", buffet: "", items: {} }]);
  const [invoiceData, setInvoiceData] = useState(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);


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

  // Inside EditMenuById.js return statement:
  {loading ? (
    <div className="flex-1 flex items-center justify-center">
      <p className="text-xl font-bold">Loading Menu Data...</p>
    </div>
  ) : (
    <Preview
      ref={componentRef}
      menuContexts={menuContexts}
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
      // onInvoiceDataChange={setInvoiceData}
    />
  )}

 
  if (loading) return <div className="p-6">Loading menu...</div>;
  if (error) return <div className="p-6 text-red-600">Error: {error}</div>;

  return (
    <div className="min-h-screen p-6 bg-gray-100">
      <div className="flex gap-6 min-w-[1000px]">
        {/* Right preview panel (exact Preview.js UI) */}
        <div className="flex-1 bg-white rounded-lg shadow p-4 overflow-auto max-h-[calc(100vh-3rem)]">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">Invoice Preview</h2>
            <div className="space-x-2">
              <button 
              onClick={handlePrint} className="px-3 py-1 bg-indigo-600 text-white rounded">Print
              </button>

              <button onClick={() => navigate(-1)} className="px-3 py-1 border rounded">Back</button>
            </div>
          </div>

          {loading ? (
            <p>Loading Data...</p>
          ) : (
          <Preview
            ref={componentRef}
            menuContexts={menuContexts}
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
          />
          )}
        </div>

      </div>
    </div>
  );
};

  

export default ViewMenu;