import React, { useState, forwardRef, useEffect } from 'react';

// Helper function to get a value from local storage or return a default
const getFromLocalStorage = (key, defaultValue) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : defaultValue;
  } catch (error) {
    console.error(`Error retrieving ${key} from local storage`, error);
    return defaultValue;
  }
};

const PreviewDocument = forwardRef(
  ({ menuContexts, onRemoveItem, onRemoveContext, formData }, ref) => {
    // Helper function to format the date
    const formatDate = (dateStr) => {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      const day = String(date.getDate()).padStart(2, '0');
      const month = date.toLocaleString('en-US', { month: 'long' }).toUpperCase();
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    };

    // Helper function to format numbers with commas and two decimal places
    const formatNumber = (num) => {
      if (num === 0) return '';
      return new Intl.NumberFormat('en-IN', {
        // style: 'currency', 
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
      }).format(num);
    };

    // Mapping of meal types to their base prices
    const pricingMap = {
      BREAKFAST: 0,
      LUNCH: 0,
      EVENING_SNACKS: 0,
      DINNER: 0,
      TIFFIN: 0,
    };

    // State for the main invoice table rows
    const [invoiceRows, setInvoiceRows] = useState(() => {
        const initialRows = menuContexts.map((ctx, i) => {
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
        return getFromLocalStorage('invoiceRows', initialRows);
    });

    // State for additional charges and final totals, with local storage integration
    const [subtotal, setSubtotal] = useState(() => getFromLocalStorage('subtotal', 0));
    const [gst, setGst] = useState(() => getFromLocalStorage('gst', 0));
    const [totalAmount, setTotalAmount] = useState(() => getFromLocalStorage('totalAmount', 0));
    const [advance, setAdvance] = useState(() => getFromLocalStorage('advance', 0));
    const [balance, setBalance] = useState(() => getFromLocalStorage('balance', 0));
    const [leadCounters, setLeadCounters] = useState(() => getFromLocalStorage('leadCounters', 0));
    const [waterBottles, setWaterBottles] = useState(() => getFromLocalStorage('waterBottles', 0));
    const [CookingCharges, setCookingCharges] = useState(() => getFromLocalStorage('CookingCharges', 0));
    const [labourCharges, setLabourCharges] = useState(() => getFromLocalStorage('labourCharges', 0));
    const [transportCharges, setTransportCharges] = useState(() => getFromLocalStorage('transportCharges', 0));

    // Recalculates all totals based on the current state of invoiceRows and other charges
    // const calculateTotals = () => {
    //   const calculatedSubtotalFromRows = invoiceRows.reduce((sum, row) => sum + row.total, 0);
    //   const newSubtotal = calculatedSubtotalFromRows + leadCounters + waterBottles + CookingCharges + labourCharges + transportCharges;
    //   const newGst = Math.round(newSubtotal * 0.05);
    //   const newTotalAmount = newSubtotal + newGst;
    //   const newBalance = newTotalAmount - advance;

    //   setSubtotal(newSubtotal);
    //   setGst(newGst);
    //   setTotalAmount(newTotalAmount);
    //   setBalance(newBalance);
    // };

    const calculateTotals = () => {
    const calculatedSubtotalFromRows = invoiceRows.reduce((sum, row) => sum + row.total, 0);
    const newSubtotal = calculatedSubtotalFromRows + leadCounters + waterBottles + CookingCharges + labourCharges + transportCharges;
    // The newTotalAmount now depends on the user-provided gst state
    const newTotalAmount = newSubtotal + gst;
    const newBalance = newTotalAmount - advance;

    setSubtotal(newSubtotal);
    setTotalAmount(newTotalAmount);
    setBalance(newBalance);
   };

    // Re-initialize rows and recalculate totals whenever menuContexts changes
    useEffect(() => {
      const newInitialRows = menuContexts.map((ctx, i) => {
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
      setInvoiceRows(newInitialRows);
    }, [menuContexts]);

    // Recalculate totals whenever any dependent state changes
    useEffect(() => {
      calculateTotals();
    }, [invoiceRows, leadCounters, waterBottles, CookingCharges, labourCharges, transportCharges, advance, gst]);

    // Persist all state variables to local storage
    useEffect(() => {
      localStorage.setItem('invoiceRows', JSON.stringify(invoiceRows));
      localStorage.setItem('subtotal', JSON.stringify(subtotal));
      localStorage.setItem('gst', JSON.stringify(gst));
      localStorage.setItem('totalAmount', JSON.stringify(totalAmount));
      localStorage.setItem('advance', JSON.stringify(advance));
      localStorage.setItem('balance', JSON.stringify(balance));
      localStorage.setItem('leadCounters', JSON.stringify(leadCounters));
      localStorage.setItem('waterBottles', JSON.stringify(waterBottles));
      localStorage.setItem('CookingCharges', JSON.stringify(CookingCharges));
      localStorage.setItem('labourCharges', JSON.stringify(labourCharges));
      localStorage.setItem('transportCharges', JSON.stringify(transportCharges));
    }, [invoiceRows, subtotal, gst, totalAmount, advance, balance, leadCounters, waterBottles, CookingCharges, labourCharges, transportCharges]);

    // Handler for individual row price change
    const handlePriceChange = (index, e) => {
      const newPrice = parseFloat(e.target.value) || 0;
      const newRows = [...invoiceRows];
      const updatedRow = newRows[index];
      updatedRow.price = newPrice;
      updatedRow.total = updatedRow.members * newPrice;
      setInvoiceRows(newRows);
    };

    // Handler for individual row total change
    const handleTotalChange = (index, e) => {
      const newTotal = parseFloat(e.target.value) || 0;
      const newRows = [...invoiceRows];
      const updatedRow = newRows[index];
      updatedRow.total = newTotal;
      updatedRow.price = updatedRow.members > 0 ? newTotal / updatedRow.members : 0;
      setInvoiceRows(newRows);
    };

    // Handlers for the final invoice section
    const handleSubtotalChange = (e) => {
      const newSubtotal = parseFloat(e.target.value) || 0;
      setSubtotal(newSubtotal);
    };

    const handleGstChange = (e) => {
      const newGst = parseFloat(e.target.value) || 0;
      setGst(newGst);
    };

    const handleTotalAmountChange = (e) => {
      const newTotalAmount = parseFloat(e.target.value) || 0;
      setTotalAmount(newTotalAmount);
    };

    const handleAdvanceChange = (e) => {
      const newAdvance = parseFloat(e.target.value) || 0;
      setAdvance(newAdvance);
    };

    const handleLeadCountersChange = (e) => setLeadCounters(parseFloat(e.target.value) || 0);
    const handleWaterBottlesChange = (e) => setWaterBottles(parseFloat(e.target.value) || 0);
    const handleCookingChargesChange = (e) => setCookingCharges(parseFloat(e.target.value) || 0);
    const handleLabourChargesChange = (e) => setLabourCharges(parseFloat(e.target.value) || 0);
    const handleTransportChargesChange = (e) => setTransportCharges(parseFloat(e.target.value) || 0);

    return (
      <div
        ref={ref}
        className="max-w-4xl mx-auto bg-white p-6 text-black font-serif border border-black print:border-none"
      >
        {/* Header */}
        <div className='header section'>
          <h2 className="Mainheading text-center text-xl text-900 font-bold font-extrabold uppercase mb-2 text-[#FFC100]">
            SHAMMUKHA CATERERS PVT. LTD
          </h2>
          <h4 className="text-center text-sm text-gray-700 mb-1 break-words">
            <span className="block sm:inline text-[#00B254]">
              An ISO 22000:2018 CERTIFIED COMPANY, Visit :
            </span>{' '}
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
            VIDYA NAGAR, HYDERABAD - 500 044 | CUSTOMER CARE: +91 98661 76781, +91 40-27656781.
            
          </h4>
          <h3 className="subheading text-center font-black uppercase text-base mb-6 text-[#00B254]">
            WE CATER TO YOUR HEALTH
          </h3>
        </div>

        {/* Form Data */}
        <div className="mb-2 text-sm font-medium text-black flex flex-wrap justify-between print:flex-row print:gap-0 uppercase">
          <div className="w-full md:w-[48%] print:w-[48%]">
            <div className="mb-1"><span style={{ fontWeight: '900', fontSize: 'larger' }}>Name:</span> {formData.name}</div>
            <div className="mb-1"><span style={{ fontWeight: '900', fontSize: 'larger' }}>Contact:</span> +91 {formData.contact}</div>
          </div>
          <div className="w-full md:w-[48%] print:w-[48%]">
            <div className="mb-1">
              <span style={{ fontWeight: '900', fontSize: 'larger' }}>Date:</span> {formatDate(formData.date)}
            </div>
            <div className="mb-1"><span style={{ fontWeight: '900', fontSize: 'larger' }}>Place:</span> {formData.place}</div>
          </div>
        </div>

        {/* Context Blocks */}
        {menuContexts.map((entry, index) => (
          <div
            key={index}
            className="mb-8 relative border border-black p-2 bg-white print:no-border"
          >
            {/* Remove Context Button */}
            <button
              onClick={() => {
                const confirmDelete = window.confirm(
                  'Are you sure you want to delete this menu context?'
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

            {/* Context Header */}
            <h4
              style={{
                fontWeight: 900,
                fontSize: 'larger',
                textTransform: 'uppercase',
                color: '#1a1a1a',
                marginBottom: '1rem',
                letterSpacing: '1.3px',
              }}
            >
              {formatDate(entry.date)} {entry.meal?.toUpperCase()} FOR {entry.members} MEMBERS{' '}
              <span style={{ color: '#FF0000' }}>{entry.buffet?.toUpperCase()}</span>
            </h4>

            {/* Category Table */}
            <table className="w-full text-sm border border-black">
              <tbody>
                {Object.entries(entry.items).map(([category, items]) => (
                  <tr key={category} className="border-b border-black align-top">
                    <td className="menuheaing p-2 font-bold text-black w-1/4 text-base uppercase border-r border-black">
                      {category}
                    </td>
                    <td className="p-1 font-bold text-base text-black w-2/3 uppercase">
                      <div className="flex flex-wrap gap-x-4 gap-y-1">
                        {items.map((item, i) => (
                          <span
                            key={i}
                            className="inline-flex items-center gap-1"
                          >
                            * {item}
                            <button
                              onClick={() => onRemoveItem(index, category, item)}
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
                ))}
              </tbody>
            </table>
          </div>
        ))}

        {/* Invoice Section */}
        <div className='invoice-section-container'>
          <h2 className="Mainheading text-center text-xl text-900 font-bold font-extrabold uppercase mb-2 text-[#FFC100]">
            SHAMMUKHA CATERERS PVT. LTD
          </h2>
          <h4 className="text-center text-sm text-gray-700 mb-1 break-words">
            <span className="block sm:inline text-[#00B254]">
              An ISO 22000:2018 CERTIFIED COMPANY, Visit :
            </span>{' '}
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
            {/* VIDYA NAGAR, HYDERABAD - 500 044 | CUSTOMER CARE: 1800 890 3081. */}
            VIDYA NAGAR, HYDERABAD - 500 044 | CUSTOMER CARE: +91 98661 76781, +91 40-27656781.

          </h4>
          <h3 className="subheading text-center font-black uppercase text-base mb-6 text-[#00B254]">
            WE CATER TO YOUR HEALTH
          </h3>

          {/* Form Data */}
          <div className="mb-2 text-sm font-medium text-black flex flex-wrap justify-between print:flex-row print:gap-0 uppercase">
            <div className="w-full md:w-[48%] print:w-[48%]">
              <div className="mb-1"><span style={{ fontWeight: '900', fontSize: 'larger' }}>Name:</span> {formData.name}</div>
              <div className="mb-1"><span style={{ fontWeight: '900', fontSize: 'larger' }}>Contact:</span> +91  {formData.contact}</div>
            </div>
            <div className="w-full md:w-[48%] print:w-[48%]">
              <div className="mb-1">
                <span style={{ fontWeight: '900', fontSize: 'larger' }}>Date:</span> {formatDate(formData.date)}
              </div>
              <div className="mb-1"><span style={{ fontWeight: '900', fontSize: 'larger' }}>Place:</span> {formData.place}</div>
            </div>
          </div>

          {/* Invoice Table with editable fields */}
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
                      value={row.price === 0 ? '' : row.price}
                      onChange={(e) => handlePriceChange(i, e)}
                      className="w-full text-center bg-transparent border-none focus:outline-none"
                    />
                  </td>
                  <td className="border border-black p-2">
                    <input
                      type="number"
                      value={row.total === 0 ? '' : row.total}
                      onChange={(e) => handleTotalChange(i, e)}
                      className="w-full text-center bg-transparent border-none focus:outline-none"
                    />
                  </td>
                </tr>
              ))}

              <tr className="text-center text-black font-bold uppercase">
                <td colSpan="4" className="border border-black p-2">Led Counters</td>
                <td className="border border-black p-2">
                  <input
                    type="number"
                    value={leadCounters === 0 ? '' : leadCounters}
                    onChange={handleLeadCountersChange}
                    className="w-full text-center bg-transparent border-none focus:outline-none"
                  />
                </td>
              </tr>

              <tr className="text-center text-black font-bold uppercase ">
                <td colSpan="4" className="border border-black p-2">Water Bottles</td>
                <td className="border border-black p-2">
                  <input
                    type="number"
                    value={waterBottles === 0 ? '' : waterBottles}
                    onChange={handleWaterBottlesChange}
                    className="w-full text-center bg-transparent border-none focus:outline-none"
                  />
                </td>
              </tr>
              <tr className="text-center text-black font-bold uppercase ">
                <td colSpan="4" className="border border-black p-2">Cooking Charges</td>
                <td className="border border-black p-2">
                  <input
                    type="number"
                    value={CookingCharges === 0 ? '' : CookingCharges}
                    onChange={handleCookingChargesChange}
                    className="w-full text-center bg-transparent border-none focus:outline-none"
                  />
                </td>
              </tr>
              <tr className="text-center text-black font-bold uppercase ">
                <td colSpan="4" className="border border-black p-2">Labour Charges</td>
                <td className="border border-black p-2">
                  <input
                    type="number"
                    value={labourCharges === 0 ? '' : labourCharges}
                    onChange={handleLabourChargesChange}
                    className="w-full text-center bg-transparent border-none focus:outline-none"
                  />
                </td>
              </tr>
              <tr className="text-center text-black font-bold uppercase ">
                <td colSpan="4" className="border border-black p-2">Transport Charges</td>
                <td className="border border-black p-2">
                  <input
                    type="number"
                    value={transportCharges === 0 ? '' : transportCharges}
                    onChange={handleTransportChargesChange}
                    className="w-full text-center bg-transparent border-none focus:outline-none"
                  />
                </td>
              </tr>
              <tr className="text-black font-bold" style={{ color: '#FF0000' }}>
                <td colSpan="4" className="border border-black p-2 uppercase ">Total</td>
                <td className="border border-black p-2" style={{ fontWeight: '600', fontSize: 'larger' }}>
                  <input
                    type="number"
                    value={subtotal === 0 ? '' : subtotal}
                    onChange={handleSubtotalChange}
                    className="w-full text-center bg-transparent border-none focus:outline-none"
                  />
                </td>
              </tr>
              <tr className="text-black font-bold">
                <td colSpan="4" className="border border-black p-2 uppercase ">GST 5%</td>
                <td className="border border-black p-2">
                  
                  <input
                    type="number"
                    value={gst === 0 ? '' : gst}
                    onChange={handleGstChange}
                    className="w-full text-center bg-transparent border-none focus:outline-none"
                  />
                </td>
              </tr>
              <tr className="text-black font-bold" style={{ color: '#FF0000' }} >
                <td colSpan="4" className="border border-black p-2 uppercase ">GRAND TOTAL</td>
                <td className="border border-black p-2" style={{ fontWeight: '600', fontSize: 'larger' }}>
                  <input
                    type="number"
                    value={totalAmount === 0 ? '' : totalAmount}
                    onChange={handleTotalAmountChange}
                    className="w-full text-center bg-transparent border-none focus:outline-none"
                  />
                </td>
              </tr>
              <tr className="text-black font-bold">
                <td colSpan="4" className="border border-black p-2 uppercase ">ADVANCE AMOUNT</td>
                <td className="border border-black p-2">
                  <input
                    type="number"
                    value={advance === 0 ? '' : advance}
                    onChange={handleAdvanceChange}
                    className="w-full text-center bg-transparent border-none focus:outline-none"
                  />
                </td>
              </tr>
              <tr className="text-black font-bold">
                <td colSpan="4" className="border border-black p-2 uppercase">BALANCE AMOUNT</td>
                <td className="border border-black p-2" style={{ fontWeight: '600', fontSize: 'larger' }}>{formatNumber(balance)}</td>
              </tr>
            </tbody>
          </table>

          {/* last section */}
          <div className='last setion'>
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
  }
);

export default PreviewDocument;