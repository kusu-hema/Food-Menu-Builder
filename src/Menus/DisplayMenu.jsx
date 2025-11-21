import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

/**
 * DisplayMenuInvoice.js
 * - UI is copied from Preview.js (visual/layout parity)
 * - Data comes from backend GET /api/menus/details/:id
 * - Read-only invoice (inputs are readonly so layout stays identical)
 * - Print button provided
 */

const DisplayMenuInvoice = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const printRef = useRef();

  const [menuContexts, setMenuContexts] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    contact: "",
    date: "",
    place: "",
  });

  // Charges & totals from backend
  const [leadCounters, setLeadCounters] = useState(0);
  const [waterBottles, setWaterBottles] = useState(0);
  const [CookingCharges, setCookingCharges] = useState(0);
  const [labourCharges, setLabourCharges] = useState(0);
  const [transportCharges, setTransportCharges] = useState(0);

  const [subtotal, setSubtotal] = useState(0);
  const [gst, setGst] = useState(0);
  const [totalAmount, setTotalAmount] = useState(0);
  const [advance, setAdvance] = useState(0);
  const [balance, setBalance] = useState(0);

  const [invoiceRows, setInvoiceRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Pricing map same as Preview.js (kept for invoice rows logic)
  const pricingMap = {
    BREAKFAST: 0,
    LUNCH: 0,
    EVENING_SNACKS: 0,
    DINNER: 0,
    TIFFIN: 0,
  };

  // Helpers
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    // support ISO date with/without time and date-only like 2026-03-15
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return dateStr;
    const day = String(d.getDate()).padStart(2, "0");
    const month = d.toLocaleString("en-US", { month: "long" }).toUpperCase();
    const year = d.getFullYear();
    return `${day}-${month}-${year}`;
  };

  const formatNumber = (num) => {
    const n = Number(num || 0);
    if (isNaN(n)) return 0;
    return new Intl.NumberFormat("en-IN", {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(n);
  };

  const formatCurrencyTwo = (val) => {
    const n = Number(val || 0);
    if (isNaN(n)) return "0.00";
    return n.toFixed(2);
  };

  // Fetch menu details from backend
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    axios
      .get(`http://localhost:4000/api/menus/details/${id}`)
      .then((res) => {
        if (cancelled) return;
        const data = res.data || {};

        // Map the backend shape to Preview.js shape
        setFormData({
          name: data.customer_name || "",
          contact: data.contact || "",
          date: data.booking_date || data.date || "",
          place: data.place || "",
        });

        // Map menu_contexts (backend) -> menuContexts (Preview.js)
        // Backend sample shows menu_contexts as array of contexts; each has categories array where each category has items[]
        const contexts = (data.menu_contexts || []).map((ctx) => {
          // convert categories array -> items object keyed by category_name (to match Preview.js rendering)
          const itemsObj = {};
          if (Array.isArray(ctx.categories)) {
            ctx.categories.forEach((cat) => {
              const key = cat.category_name || "UNNAMED";
              itemsObj[key] = Array.isArray(cat.items) ? cat.items : [];
            });
          }
          return {
            date: ctx.event_date || ctx.date || ctx.eventDate || formData.date,
            meal: ctx.meal || "",
            members: ctx.members || 0,
            buffet: ctx.buffet === true || ctx.buffet === "true" ? "YES" : String(ctx.buffet || ""),
            // match Preview.js expects ctx.items as an object keyed by category
            items: itemsObj,
          };
        });

        setMenuContexts(contexts);

        // Totals and charges
        setSubtotal(parseFloat(data.subtotal || 0));
        setGst(parseFloat(data.gst || 0));
        setTotalAmount(parseFloat(data.grand_total || data.total || 0));
        setAdvance(parseFloat(data.advance || 0));
        setBalance(parseFloat(data.balance || 0));

        setLeadCounters(parseFloat(data.lead_counters || data.leadCounters || 0));
        setWaterBottles(parseFloat(data.water_bottles || data.waterBottles || 0));
        setCookingCharges(parseFloat(data.cooking_charges || data.cookingCharges || 0));
        setLabourCharges(parseFloat(data.labour_charges || data.labourCharges || 0));
        setTransportCharges(parseFloat(data.transport_charges || data.transportCharges || 0));
      })
      .catch((err) => {
        console.error("Failed to fetch menu details:", err);
        setError("Failed to load invoice from server.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [id]);

  // Build invoiceRows from menuContexts similar to Preview.js
  useEffect(() => {
    const rows = menuContexts.map((ctx, i) => {
      const meal = (ctx.meal || "").toString().toUpperCase();
      const members = parseInt(ctx.members, 10) || 0;
      const price = pricingMap[meal] || 0;
      const total = members * price;
      return {
        sno: i + 1,
        event: `${formatDate(ctx.date)} ${meal}`,
        members,
        price,
        total,
      };
    });
    setInvoiceRows(rows);
  }, [menuContexts]);

  // If backend provided subtotal/gst/balance, keep them; else compute from rows + charges
  useEffect(() => {
    // calculate if backend didn't provide subtotal
    if (!subtotal || subtotal === 0) {
      const rowsTotal = invoiceRows.reduce((s, r) => s + Number(r.total || 0), 0);
      const newSubtotal = rowsTotal + Number(leadCounters || 0) + Number(waterBottles || 0) + Number(CookingCharges || 0) + Number(labourCharges || 0) + Number(transportCharges || 0);
      setSubtotal(newSubtotal);
      const newTotal = newSubtotal + Number(gst || 0);
      setTotalAmount(newTotal);
      setBalance(newTotal - Number(advance || 0));
    }
  }, [invoiceRows, leadCounters, waterBottles, CookingCharges, labourCharges, transportCharges, gst, advance]); // eslint-disable-line

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <div className="p-6 text-center">Loading invoice...</div>;
  }

  if (error) {
    return <div className="p-6 text-center text-red-600">{error}</div>;
  }

  return (
    <div ref={printRef} className="max-w-4xl mx-auto bg-white p-6 text-black font-serif border border-black print:border-none my-6">
      {/* Print & Back controls (not printed) */}
      <div className="flex justify-end gap-2 mb-4 print:hidden">
        <button onClick={() => navigate(-1)} className="px-3 py-1 border rounded">Back</button>
        <button onClick={handlePrint} className="px-3 py-1 bg-indigo-600 text-white rounded">Print</button>
      </div>

      {/* ---------------- HEADER ---------------- */}
      <div className="header section">
        <h2 className="Mainheading text-center text-xl text-900 font-bold font-extrabold uppercase mb-2 text-[#FFC100]">
          SHAMMUKHA CATERERS PVT. LTD
        </h2>
        <h4 className="text-center text-sm text-gray-700 mb-1 break-words">
          <span className="block sm:inline text-[#00B254]">
            An ISO 22000:2018 CERTIFIED COMPANY, Visit :
          </span>{" "}
          <a
            href="https://www.shanmukhacaterers.co.in/"
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 hover:underline block sm:inline underline-offset-2"
          >
            www.shammukhacaterers.co.in
          </a>
        </h4>
        <h4 className="text-center text-sm text-gray-700 mb-4">
          VIDYA NAGAR, HYDERABAD - 500 044 | CUSTOMER CARE: 1800 890 3081.
        </h4>
        <h3 className="subheading text-center font-black uppercase text-base mb-6 text-[#00B254]">
          WE CATER TO YOUR HEALTH
        </h3>
      </div>

      {/* ---------------- CUSTOMER INFO ---------------- */}
      <div className="mb-2 text-sm font-medium text-black flex flex-wrap justify-between print:flex-row print:gap-0 uppercase">
        <div className="w-full md:w-[48%] print:w-[48%]">
          <div className="mb-1">
            <span style={{ fontWeight: "900", fontSize: "larger" }}>
              Name:
            </span>{" "}
            {formData.name}
          </div>
          <div className="mb-1">
            <span style={{ fontWeight: "900", fontSize: "larger" }}>
              Contact:
            </span>{" "}
            +91 {formData.contact}
          </div>
        </div>
        <div className="w-full md:w-[48%] print:w-[48%]">
          <div className="mb-1">
            <span style={{ fontWeight: "900", fontSize: "larger" }}>
              Date:
            </span>{" "}
            {formatDate(formData.date)}
          </div>
          <div className="mb-1">
            <span style={{ fontWeight: "900", fontSize: "larger" }}>
              Place:
            </span>{" "}
            {formData.place}
          </div>
        </div>
      </div>

      {/* ---------------- CONTEXT LIST ---------------- */}
      {menuContexts.map((ctx, index) => (
        <div
          key={index}
          className="mb-8 relative border border-black p-2 bg-white print:no-border"
        >
          {/* preview had remove buttons; for display we hide them */}
          <h4
            style={{
              fontWeight: 900,
              fontSize: "larger",
              textTransform: "uppercase",
              color: "#1a1a1a",
              marginBottom: "1rem",
              letterSpacing: "1.3px",
            }}
            className="font-bold mb-2"
          >
            {formatDate(ctx.date)} {ctx.meal} FOR {ctx.members} MEMBERS{" "}
            <span style={{ color: "#FF0000" }}>
              {String(ctx.buffet || "").toUpperCase()}
            </span>
          </h4>

          {/* Category Table */}
          <table className="w-full text-sm border border-black">
            <tbody>
              {Object.entries(ctx.items || {}).map(([cat, items]) => (
                <tr
                  key={cat}
                  className="border-b border-black align-top"
                >
                  <td className="menuheaing p-2 font-bold text-black w-1/4 text-base uppercase border-r border-black">
                    {cat}
                  </td>
                  <td className="p-1 font-bold text-base text-black w-2/3 uppercase">
                    <div className="flex flex-wrap gap-x-4 gap-y-1">
                      {items.map((item, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1"
                        >
                          * {item}{" "}
                        </span>
                      ))}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      ))}

      {/* ---------------- INVOICE SECTION ---------------- */}
      <div className="invoice-section-container">
        <h2 className="Mainheading text-center text-xl text-900 font-bold font-extrabold uppercase mb-2 text-[#FFC100]">
          SHAMMUKHA CATERERS PVT. LTD
        </h2>
        <h4 className="text-center text-sm text-gray-700 mb-1 break-words">
          <span className="block sm:inline text-[#00B254]">
            An ISO 22000:2018 CERTIFIED COMPANY, Visit :
          </span>{" "}
          <a
            href="https://www.shanmukhacaterers.co.in/"
            target="_blank"
            rel="noreferrer"
            className="text-blue-600 hover:underline block sm:inline underline-offset-2"
          >
            www.shammukhacaterers.co.in
          </a>
        </h4>
        <h4 className="text-center text-sm text-gray-700 mb-4">
          VIDYA NAGAR, HYDERABAD - 500 044 | CUSTOMER CARE: 1800 890 3081.
        </h4>
        <h3 className="subheading text-center font-black uppercase text-base mb-6 text-[#00B254]">
          WE CATER TO YOUR HEALTH
        </h3>

        {/* Customer Info */}
        <div className="mb-2 text-sm font-medium text-black flex flex-wrap justify-between print:flex-row print:gap-0 uppercase">
          <div className="w-full md:w-[48%] print:w-[48%]">
            <div className="mb-1">
              <span style={{ fontWeight: "900", fontSize: "larger" }}>Name:</span>{" "}
              {formData.name}
            </div>
            <div className="mb-1">
              <span style={{ fontWeight: "900", fontSize: "larger" }}>Contact:</span>{" "}
              +91 {formData.contact}
            </div>
          </div>
          <div className="w-full md:w-[48%] print:w-[48%]">
            <div className="mb-1">
              <span style={{ fontWeight: "900", fontSize: "larger" }}>Date:</span>{" "}
              {formatDate(formData.date)}
            </div>
            <div className="mb-1">
              <span style={{ fontWeight: "900", fontSize: "larger" }}>Place:</span>{" "}
              {formData.place}
            </div>
          </div>
        </div>

        {/* ---------------- Invoice Table ---------------- */}
        <table className="w-full text-sm border border-black mt-6">
          <thead>
            <tr className="bg-[#FFC100] text-black font-bold text-center">
              <th className="border border-black p-2">SNO</th>
              <th className="border border-black p-2">EVENT</th>
              <th className="border border-black p-2">MEMBERS</th>
              <th className="border border-black p-2">PRICE</th>
              <th className="border border-black p-2">TOTAL</th>
            </tr>
          </thead>

          <tbody className="bg-[#f2dcdb] text-black font-bold text-center">
            {invoiceRows.map((row, i) => (
              <tr key={i} className="text-center text-black font-semibold">
                <td className="border border-black p-2">{row.sno}</td>
                <td className="border border-black p-2">{row.event}</td>
                <td className="border border-black p-2">{row.members}</td>
                <td className="border border-black p-2">
                  <input
                    type="number"
                    value={row.price}
                    readOnly
                    className="w-full text-center bg-transparent border-none focus:outline-none"
                  />
                </td>
                <td className="border border-black p-2">
                  <input
                    type="number"
                    value={row.total}
                    readOnly
                    className="w-full text-center bg-transparent border-none focus:outline-none"
                  />
                </td>
              </tr>
            ))}

            {/* Extra Charges */}
            <tr className="text-center text-black font-bold uppercase">
              <td colSpan="4" className="border border-black p-2">
                LED Counters
              </td>
              <td className="border border-black p-2">
                <input
                  type="text"
                  value={formatCurrencyTwo(leadCounters)}
                  readOnly
                  className="w-full text-center bg-transparent border-none focus:outline-none"
                />
              </td>
            </tr>

            <tr className="text-center text-black font-bold uppercase">
              <td colSpan="4" className="border border-black p-2">
                Water Bottles
              </td>
              <td className="border border-black p-2">
                <input
                  type="text"
                  value={formatCurrencyTwo(waterBottles)}
                  readOnly
                  className="w-full text-center bg-transparent border-none focus:outline-none"
                />
              </td>
            </tr>

            <tr className="text-center text-black font-bold uppercase">
              <td colSpan="4" className="border border-black p-2">
                Cooking Charges
              </td>
              <td className="border border-black p-2">
                <input
                  type="text"
                  value={formatCurrencyTwo(CookingCharges)}
                  readOnly
                  className="w-full text-center bg-transparent border-none focus:outline-none"
                />
              </td>
            </tr>

            <tr className="text-center text-black font-bold uppercase">
              <td colSpan="4" className="border border-black p-2">
                Labour Charges
              </td>
              <td className="border border-black p-2">
                <input
                  type="text"
                  value={formatCurrencyTwo(labourCharges)}
                  readOnly
                  className="w-full text-center bg-transparent border-none focus:outline-none"
                />
              </td>
            </tr>

            <tr className="text-center text-black font-bold uppercase">
              <td colSpan="4" className="border border-black p-2">
                Transport Charges
              </td>
              <td className="border border-black p-2">
                <input
                  type="text"
                  value={formatCurrencyTwo(transportCharges)}
                  readOnly
                  className="w-full text-center bg-transparent border-none focus:outline-none"
                />
              </td>
            </tr>

            {/* TOTAL */}
            <tr className="text-black font-bold" style={{ color: "#FF0000" }}>
              <td colSpan="4" className="border border-black p-2 uppercase">
                TOTAL
              </td>
              <td className="border border-black p-2" style={{ fontWeight: "600", fontSize: "larger" }}>
                <input
                  type="text"
                  value={formatCurrencyTwo(subtotal)}
                  readOnly
                  className="w-full text-center bg-transparent border-none focus:outline-none"
                />
              </td>
            </tr>

            {/* GST */}
            <tr className="text-black font-bold">
              <td colSpan="4" className="border border-black p-2 uppercase">
                GST
              </td>
              <td className="border border-black p-2">
                <input
                  type="text"
                  value={formatCurrencyTwo(gst)}
                  readOnly
                  className="w-full text-center bg-transparent border-none focus:outline-none"
                />
              </td>
            </tr>

            {/* GRAND TOTAL */}
            <tr className="text-black font-bold" style={{ color: "#FF0000" }}>
              <td colSpan="4" className="border border-black p-2 uppercase">
                GRAND TOTAL
              </td>
              <td className="border border-black p-2" style={{ fontWeight: "600", fontSize: "larger" }}>
                <input
                  type="text"
                  value={formatCurrencyTwo(totalAmount)}
                  readOnly
                  className="w-full text-center bg-transparent border-none focus:outline-none"
                />
              </td>
            </tr>

            {/* ADVANCE */}
            <tr className="text-black font-bold">
              <td colSpan="4" className="border border-black p-2 uppercase">
                ADVANCE
              </td>
              <td className="border border-black p-2">
                <input
                  type="text"
                  value={formatCurrencyTwo(advance)}
                  readOnly
                  className="w-full text-center bg-transparent border-none focus:outline-none"
                />
              </td>
            </tr>

            {/* BALANCE */}
            <tr className="text-black font-bold">
              <td colSpan="4" className="border border-black p-2 uppercase">
                BALANCE AMOUNT
              </td>
              <td className="border border-black p-2" style={{ fontWeight: "600", fontSize: "larger" }}>
                {formatNumber(balance)}
              </td>
            </tr>
          </tbody>
        </table>

        {/* Last Section / Notes */}
        <div className="last-section">
          <h4 className="text-center text-black font-bold text-sm mb-4 mt-4">
            NOTE: ADDITIONAL WILL BE CHARGED FOR EXTRA PLATES
          </h4>
          <h4 className="text-center text-black font-bold text-sm mb-4">
            *** With best Wishes from Shanmukha Caterers Pvt.Ltd and Service....
          </h4>
          <h4 className="text-center text-black font-bold text-sm mb-4">
            From Shanmukha Caterers Pvt.Ltd
          </h4>
          <h4 className="text-center text-black font-bold text-sm mb-4">
            Manager
          </h4>
        </div>
      </div>
    </div>
  );
};

export default DisplayMenuInvoice;
