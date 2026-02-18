import React, { useState, forwardRef, useEffect } from "react";

  // Read from localStorage safely
  const getFromLocalStorage = (key, defaultValue) => {
    try {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : defaultValue;
    } catch {
      return defaultValue;
    }
  };

const Preview = forwardRef( 
  ( 
    {
      menuContexts,
      onRemoveItem,
      onRemoveContext,
      formData,
      onInvoiceDataChange, 
      // Important
    },
    ref
  ) => {
    // Format date
    const formatDate = (dateStr) => {
      if (!dateStr) return "";
      const date = new Date(dateStr);
      const day = String(date.getDate()).padStart(2, "0");
      const month = date.toLocaleString("en-US", { month: "long" }).toUpperCase();
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    };

    // Format number (no empty string issues)
    const formatNumber = (num) => {
      if (!num || isNaN(num)) return 0;
      return new Intl.NumberFormat("en-IN", {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(Number(num));
    };

    // Pricing map
    const pricingMap = {
      BREAKFAST: 0,
      LUNCH: 0,
      EVENING_SNACKS: 0,
      DINNER: 0,
      TIFFIN: 0,
    };

    // Invoice rows
    const [invoiceRows, setInvoiceRows] = useState(() => {
      const initial = menuContexts.map((ctx, i) => {
        const meal = ctx.meal?.toUpperCase();
        const members = parseInt(ctx.members) || 0;
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

      return getFromLocalStorage("invoiceRows", initial);
    });

    // Invoice Values
    const [subtotal, setSubtotal] = useState(() =>
      getFromLocalStorage("subtotal", 0)
    );

    const [gst, setGst] = useState(() => {
    if (formData?.gst !== undefined) return Number(formData.gst);
    return getFromLocalStorage("gst", 0);
    });

    const [totalAmount, setTotalAmount] = useState(() =>
      getFromLocalStorage("totalAmount", 0)
    );
    
    const [advance, setAdvance] = useState(() => 
    formData?.advance !== undefined ? Number(formData.advance) : getFromLocalStorage("advance", 0)
    );

    const [balance, setBalance] = useState(() =>
      getFromLocalStorage("balance", 0)
    );

    const [leadCounters, setLeadCounters] = useState(() => 
    formData?.lead_counters !== undefined ? Number(formData.lead_counters) : getFromLocalStorage("leadCounters", 0)
    );

    const [waterBottles, setWaterBottles] = useState(() => 
    formData?.water_bottles !== undefined ? Number(formData.water_bottles) : getFromLocalStorage("waterBottles", 0)
    );

    const [CookingCharges, setCookingCharges] = useState(() => 
      formData?.cooking_charges !== undefined ? Number(formData.cooking_charges) : getFromLocalStorage("CookingCharges", 0)
    );

    const [labourCharges, setLabourCharges] = useState(() => 
      formData?.labour_charges !== undefined ? Number(formData.labour_charges) : getFromLocalStorage("labourCharges", 0)
    );

    const [transportCharges, setTransportCharges] = useState(() => 
      formData?.transport_charges !== undefined ? Number(formData.transport_charges) : getFromLocalStorage("transportCharges", 0)
    );

    // Recalculate totals
    const calculateTotals = () => {
      const rowsTotal = invoiceRows.reduce((sum, row) => sum + row.total, 0);

      const newSubtotal =
        rowsTotal +
        leadCounters +
        waterBottles +
        CookingCharges +
        labourCharges +
        transportCharges;

      const newTotal = newSubtotal + gst;
      const newBalance = newTotal - advance;

      setSubtotal(newSubtotal);
      setTotalAmount(newTotal);
      setBalance(newBalance);
    };

    // Update rows when menu changes
    // useEffect(() => {
    //   const updated = menuContexts.map((ctx, i) => {
    //     const meal = ctx.meal?.toUpperCase();
    //     const members = parseInt(ctx.members) || 0;
    //     const price = pricingMap[meal] || 0;
    //     const total = members * price;

    //     return {
    //       sno: i + 1,
    //       event: `${formatDate(ctx.date)} ${meal}`,
    //       members,
    //       price,
    //       total,
    //     };
    //   });

    //   setInvoiceRows(updated);
    // }, [menuContexts]);


    useEffect(() => {
      const updated = menuContexts.map((ctx, i) => {
        const meal = ctx.meal?.toUpperCase();
        const members = parseInt(ctx.members) || 0;
        
        // NEW: Use existing price from database if available, else fallback to 0
        const price = (ctx.price !== undefined && ctx.price !== null) 
                      ? ctx.price 
                      : (pricingMap[meal] || 0);

        const total = (ctx.total !== undefined && ctx.total !== null) 
                      ? ctx.total 
                      : (members * price);

        return {
          sno: i + 1,
          event: `${formatDate(ctx.date)} ${meal}`,
          members,
          price,
          total,
        };
      });

      setInvoiceRows(updated);
    }, [menuContexts]);

    // Recalculate totals on changes
    useEffect(() => {
      calculateTotals();
    }, [
      invoiceRows,
      leadCounters,
      waterBottles,
      CookingCharges,
      labourCharges,
      transportCharges,
      gst,
      advance,
    ]);

    // Save to localStorage
    useEffect(() => {
      if (formData) {
        // Explicitly check for null/undefined and cast to Number
        setGst(Number(formData.gst) || 0);
        setAdvance(Number(formData.advance) || 0);
        setLeadCounters(Number(formData.lead_counters) || 0);
        setWaterBottles(Number(formData.water_bottles) || 0);
        setCookingCharges(Number(formData.cooking_charges) || 0);
        setLabourCharges(Number(formData.labour_charges) || 0);
        setTransportCharges(Number(formData.transport_charges) || 0);
      }
    }, [formData]); // This triggers when EditMenuById finishes fetching 

    // Send data to parent
    useEffect(() => {
      if (typeof onInvoiceDataChange === "function") {
        onInvoiceDataChange({
          rows: invoiceRows,
          subtotal,
          gst,
          grand_total: totalAmount,
          advance,
          balance,
          lead_counters: leadCounters,
          water_bottles: waterBottles,
          cooking_charges: CookingCharges,
          labour_charges: labourCharges,
          transport_charges: transportCharges,
        });
      }
    }, [
      subtotal,
      gst,
      totalAmount,
      advance,
      balance,
      leadCounters,
      waterBottles,
      CookingCharges,
      labourCharges,
      transportCharges,
    ]);

    // Add this near your other useEffects
    useEffect(() => {
      // Check if we have valid formData/menuContexts that imply an "Edit" mode
      if (menuContexts.length > 0) {
        // These should come from the parent state if provided
        // You might need to pass the full 'data' object or specific fields to Preview
      }
    }, [menuContexts]);

    // Update row price
    const handlePriceChange = (i, e) => {
      const newPrice = parseFloat(e.target.value) || 0;
      const rows = [...invoiceRows];
      rows[i].price = newPrice;
      rows[i].total = rows[i].members * newPrice;
      setInvoiceRows(rows);
    };

    // Update row total
    const handleTotalChange = (i, e) => {
      const newTotal = parseFloat(e.target.value) || 0;
      const rows = [...invoiceRows];
      rows[i].total = newTotal;
      rows[i].price = rows[i].members > 0 ? newTotal / rows[i].members : 0;
      setInvoiceRows(rows);
    };


    // Add this outside your component or at the top of the Preview file
    const CATEGORY_ORDER = [
      "PRASADAM",
      "BREAKFAST",
      "WELCOME DRINKS",
      "WELCOME SNACKS",
      "SALADS",
      "CHINESE COUNTER",
      "CHAT COUNTER",
      "TIFFINS",
      "ROTI",
      "RICE",
      "SOUTH CURRIES",
      "NORTH CURRIES",
      "DAL & LIQUIDS",
      "PICKLES & POWDERS",
      "SWEETS",
      "HOT",
      "SNACKS",
      "DESSERT",
      "FRUIT STALL",
      "PAN COUNTER",
      "COMMON ITEMS",
      "SARRAY"
    ];

    return (
      <div
        ref={ref}
        className="max-w-4xl mx-auto bg-white p-6 text-black font-serif border border-black print:border-none"
      >
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
          {/* <h4 className="text-center text-sm text-gray-700 mb-4">
            VIDYA NAGAR, HYDERABAD - 500 044 | CUSTOMER CARE: 1800 890 3081.
          </h4> */}
          <h4 className="text-center text-sm text-gray-700 ">
            VIDYA NAGAR, HYDERABAD - 500 044 | CUSTOMER CARE: +91 98661 76781, +040 2765 6781.
          </h4>
          <h4 className="text-center text-sm text-gray-700 mb-4">
              FSSAI NUMBER :- 10018047001017 |  GST NUMBER : 36ABACS0489B1ZK 
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
            <button
              onClick={() => {
                const confirmDelete = window.confirm(
                  "Are you sure you want to delete this menu context?"
                );
                if (confirmDelete) {
                  onRemoveContext(index);
                }
              }}
              className="absolute top-2 right-2 text-red-600 text-sm border border-gray-300 rounded px-2 py-0.5 hover:bg-red-50 transition print:hidden"
              title="Remove entire menu context"
            >
              ❌
            </button>

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
                {ctx.buffet?.toUpperCase()}
              </span>
            </h4>

            {/* Category Table */}
            <table className="w-full text-sm border border-black">
              <tbody>
                {Object.keys(ctx.items)
                  // Sort keys based on our predefined order
                  .sort((a, b) => {
                    const indexA = CATEGORY_ORDER.indexOf(a.toUpperCase());
                    const indexB = CATEGORY_ORDER.indexOf(b.toUpperCase());
                    
                    // If a category isn't in the list, move it to the end
                    const finalA = indexA === -1 ? 999 : indexA;
                    const finalB = indexB === -1 ? 999 : indexB;
                    
                    return finalA - finalB;
                  })
                  .map((cat) => {
                    const items = ctx.items[cat];
                    return (
                      <tr key={cat} className="border-b border-black align-top">
                        <td className="menuheaing p-2 font-bold text-black w-1/4 text-base uppercase border-r border-black">
                          {cat}
                        </td>
                        <td className="p-1 font-bold text-base text-black w-2/3 uppercase">
                          <div className="flex flex-wrap gap-x-4 gap-y-1">
                            {items.map((item, i) => (
                              <span key={i} className="inline-flex items-center gap-1">
                                * {item}{" "}
                                <button
                                  onClick={() => onRemoveItem(index, cat, item)}
                                  className="text-red-600 text-xs border border-gray-300 rounded px-1 py-0.5 hover:bg-red-50 transition print:hidden"
                                  title="Remove item"
                                >
                                  ❌
                                </button>
                              </span>
                            ))}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
              </tbody>
            </table>
          </div>
        ))}

        {/* ---------------- INVOICE SECTION ---------------- */}
        {/* Invoice Table with all editable fields */}

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
          {/* <h4 className="text-center text-sm text-gray-700 mb-4">
            VIDYA NAGAR, HYDERABAD - 500 044 | CUSTOMER CARE: 1800 890 3081.
          </h4> */}
          {/* <h4 className="text-center text-sm text-gray-700 mb-4">
            VIDYA NAGAR, HYDERABAD - 500 044 | CUSTOMER CARE: +91 98661 76781, +91 4027 656 781.
          </h4> */}

           <h4 className="text-center text-sm text-gray-700 ">
            VIDYA NAGAR, HYDERABAD - 500 044 | CUSTOMER CARE: +91 98661 76781, +040 2765 6781.
          </h4>
          <h4 className="text-center text-sm text-gray-700 mb-4">
              FSSAI NUMBER :- 10018047001017 |  GST NUMBER : 36ABACS0489B1ZK 
          </h4>

           {/* +91 98661 76781, +91 4027 656 781. */}
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

                  {/* Price */}
                  <td className="border border-black p-2">
                    <input
                      type="number"
                      // value={row.price}
                      value={row.price === 0 ? "" : row.price}
                      onChange={(e) => handlePriceChange(i, e)}
                      className="w-full text-center bg-transparent border-none focus:outline-none"
                    />
                  </td>

                  {/*  Total */}
                  <td className="border border-black p-2">
                    <input
                      type="number"
                      // value={row.total}
                      value={row.total === 0 ? "" : row.total}
                      onChange={(e) => handleTotalChange(i, e)}
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
                    type="number"
                    // value={leadCounters}
                    value={leadCounters === 0 ? "" : leadCounters}
                    onChange={(e) => setLeadCounters(parseFloat(e.target.value) || 0)}
                    className="w-full text-center bg-transparent border-none focus:outline-none"
                  />
                </td>
              </tr>

              {/*  WATER BOTTLES */}
              <tr className="text-center text-black font-bold uppercase">
                <td colSpan="4" className="border border-black p-2">
                  Water Bottles
                </td>
                <td className="border border-black p-2">
                  <input
                    type="number"
                    // value={waterBottles}
                    value={waterBottles === 0 ? "" : waterBottles}
                    onChange={(e) => setWaterBottles(parseFloat(e.target.value) || 0)}
                    className="w-full text-center bg-transparent border-none focus:outline-none"
                  />
                </td>
              </tr>

              {/* COOKING CHARGES */}
              <tr className="text-center text-black font-bold uppercase">
                <td colSpan="4" className="border border-black p-2">
                  Cooking Charges
                </td>
                <td className="border border-black p-2">
                  <input
                    type="number"
                    // value={CookingCharges}
                    value={CookingCharges === 0 ? "" : CookingCharges}
                    onChange={(e) => setCookingCharges(parseFloat(e.target.value) || 0)}
                    className="w-full text-center bg-transparent border-none focus:outline-none"
                  />
                </td>
              </tr>
              
              {/* LABOUR CHARGES */}
              <tr className="text-center text-black font-bold uppercase">
                <td colSpan="4" className="border border-black p-2">
                  Labour Charges
                </td>
                <td className="border border-black p-2">
                  <input
                    type="number"
                    // value={labourCharges}
                    value={labourCharges === 0 ? "" : labourCharges}
                    onChange={(e) => setLabourCharges(parseFloat(e.target.value) || 0)}
                    className="w-full text-center bg-transparent border-none focus:outline-none"
                  />
                </td>
              </tr>
              
              {/* TRANSPORT CHANGES */}
              <tr className="text-center text-black font-bold uppercase">
                <td colSpan="4" className="border border-black p-2">
                  Transport Charges
                </td>
                <td className="border border-black p-2">
                  <input
                    type="number"
                    // value={transportCharges}
                    value={transportCharges === 0 ? "" : transportCharges}
                    onChange={(e) => setTransportCharges(parseFloat(e.target.value) || 0)}
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
                    type="number"
                    // value={subtotal}
                    value={subtotal === 0 ? "" : subtotal}
                    onChange={(e) => setSubtotal(parseFloat(e.target.value) || 0)}
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
                    type="number"
                    // value={gst}
                    value={gst === 0 ? "" : gst}
                    onChange={(e) => setGst(parseFloat(e.target.value) || 0)}
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
                    type="number"
                    // value={totalAmount}
                    value={totalAmount === 0 ? "" : totalAmount}
                    onChange={(e) => setTotalAmount(parseFloat(e.target.value) || 0)}
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
                    type="number"
                    // value={advance}
                    value={advance === 0 ? "" : advance}
                    onChange={(e) => setAdvance(parseFloat(e.target.value) || 0)}
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
                  {/* {formatNumber(balance)} */}
                {balance === 0 ? "" : formatNumber(balance)} 
                </td>
              </tr>
            </tbody>
          </table>

          {/* Last Section / Notes */}
          <div className="last-section">
            <h4 className="text-center text-black font-bold text-sm mb-4 mt-4">
              NOTE: ADDITIONAL AMOUNT WILL BE CHARGED FOR EXTRA PLATES
            </h4>
            <h4 className="text-center text-black font-bold text-sm mb-4">
              *** With best Wishes from Shanmukha Caterers Pvt.Ltd and Service....
            </h4>
            <h4 className="text-center text-black font-bold text-sm mb-4" style={{ color: "#06ae06" }}>
              ANUSHA. SALE’S TEAM’S
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
  }
);

export default Preview;