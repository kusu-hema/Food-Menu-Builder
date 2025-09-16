import React, { useState, forwardRef, useEffect } from 'react';

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

    // Mapping of meal types to their base prices
    const pricingMap = {
      BREAKFAST: 0,
      LUNCH: 0,
      EVENING_SNACKS: 0,
      DINNER: 0,
      TIFFIN: 0,
    };

    // Initialize invoice rows based on menu contexts
    const initialInvoiceRows = menuContexts.map((ctx, i) => {
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

    // State for the main invoice table rows
    const [invoiceRows, setInvoiceRows] = useState(initialInvoiceRows);

    // State for additional charges and final totals
    const [subtotal, setSubtotal] = useState(0);
    const [gst, setGst] = useState(0);
    const [totalAmount, setTotalAmount] = useState(0);
    const [advance, setAdvance] = useState(50000);
    const [balance, setBalance] = useState(0);
    const [leadCounters, setLeadCounters] = useState(0);
    const [waterBottles, setWaterBottles] = useState(0);
    const [CookingCharges, setCookingCharges] = useState(0);
    const [labourCharges, setLabourCharges] = useState(0);
    const [transportCharges, setTransportCharges] = useState(0);

    // Recalculates all totals based on the current state of invoiceRows and other charges
    const calculateTotals = () => {
      const calculatedSubtotalFromRows = invoiceRows.reduce((sum, row) => sum + row.total, 0);
      const newSubtotal = calculatedSubtotalFromRows + leadCounters + waterBottles  + CookingCharges  + labourCharges + transportCharges;
      const newGst = Math.round(newSubtotal * 0.5); // 10% GST
      const newTotalAmount = newSubtotal + newGst;
      const newBalance = newTotalAmount - advance;

      setSubtotal(newSubtotal);
      setGst(newGst);
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
    }, [invoiceRows, leadCounters, waterBottles, labourCharges, transportCharges, advance]);

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
        const newGst = Math.round(newSubtotal * 0.10);
        const newTotalAmount = newSubtotal + newGst;
        const newBalance = newTotalAmount - advance;
        setSubtotal(newSubtotal);
        setGst(newGst);
        setTotalAmount(newTotalAmount);
        setBalance(newBalance);
    };

    const handleGstChange = (e) => {
        const newGst = parseFloat(e.target.value) || 0;
        const newTotalAmount = subtotal + newGst;
        const newBalance = newTotalAmount - advance;
        setGst(newGst);
        setTotalAmount(newTotalAmount);
        setBalance(newBalance);
    };

    const handleTotalAmountChange = (e) => {
        const newTotalAmount = parseFloat(e.target.value) || 0;
        const newBalance = newTotalAmount - advance;
        setTotalAmount(newTotalAmount);
        setBalance(newBalance);
    };

    const handleAdvanceChange = (e) => {
        const newAdvance = parseFloat(e.target.value) || 0;
        const newBalance = totalAmount - newAdvance;
        setAdvance(newAdvance);
        setBalance(newBalance);
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
            VIDYA NAGAR, HYDERABAD - 500 044 | CUSTOMER CARE: 1800 890 3081.
          </h4>
          <h3 className="subheading text-center font-black uppercase text-base mb-6 text-[#00B254]">
            WE CATER TO YOUR HEALTH
          </h3>
        </div>

        {/* Form Data */}
        <div className="mb-2 text-sm font-medium text-black flex flex-wrap justify-between print:flex-row print:gap-0 uppercase">
          <div className="w-full md:w-[48%] print:w-[48%]">
            <div className="mb-1"><span style={{ fontWeight: '900', fontSize: 'larger' }}>Name:</span> {formData.name}</div>
            <div className="mb-1"><span style={{ fontWeight: '900', fontSize: 'larger' }}>Contact:</span> {formData.contact}</div>
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
          VIDYA NAGAR, HYDERABAD - 500 044 | CUSTOMER CARE: 1800 890 3081.
        </h4>
        <h3 className="subheading text-center font-black uppercase text-base mb-6 text-[#00B254]">
          WE CATER TO YOUR HEALTH
        </h3>

        {/* Form Data */}
        <div className="mb-2 text-sm font-medium text-black flex flex-wrap justify-between print:flex-row print:gap-0 uppercase">
          <div className="w-full md:w-[48%] print:w-[48%]">
            <div className="mb-1"><span style={{ fontWeight: '900', fontSize: 'larger' }}>Name:</span> {formData.name}</div>
            <div className="mb-1"><span style={{ fontWeight: '900', fontSize: 'larger' }}>Contact:</span> {formData.contact}</div>
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
                    value={row.price}
                    onChange={(e) => handlePriceChange(i, e)}
                    className="w-full text-center bg-transparent border-none focus:outline-none"
                  />
                </td>
                <td className="border border-black p-2">
                  <input
                    type="number"
                    value={row.total}
                    onChange={(e) => handleTotalChange(i, e)}
                    className="w-full text-center bg-transparent border-none focus:outline-none"
                  />
                </td>
              </tr>
            ))}
            <tr className="text-center text-black font-bold">
              <td colSpan="4" className="border border-black p-2">Led Counters</td>
              <td className="border border-black p-2">
                <input
                  type="number"
                  value={leadCounters}
                  onChange={handleLeadCountersChange}
                  className="w-full text-center bg-transparent border-none focus:outline-none"
                />
              </td>
            </tr>
            <tr className="text-center text-black font-bold">
              <td colSpan="4" className="border border-black p-2">Water Bottles</td>
              <td className="border border-black p-2">
                <input
                  type="number"
                  value={waterBottles}
                  onChange={handleWaterBottlesChange}
                  className="w-full text-center bg-transparent border-none focus:outline-none"
                />
              </td>
            </tr>
             <tr className="text-center text-black font-bold">
              <td colSpan="4" className="border border-black p-2">Cooking Charges</td>
              <td className="border border-black p-2">
                <input
                  type="number"
                  value={CookingCharges}
                  onChange={handleCookingChargesChange}
                  className="w-full text-center bg-transparent border-none focus:outline-none"
                />
              </td>
            </tr>
            <tr className="text-center text-black font-bold">
              <td colSpan="4" className="border border-black p-2">Labour Charges</td>
              <td className="border border-black p-2">
                <input
                  type="number"
                  value={labourCharges}
                  onChange={handleLabourChargesChange}
                  className="w-full text-center bg-transparent border-none focus:outline-none"
                />
              </td>
            </tr>
            <tr className="text-center text-black font-bold">
              <td colSpan="4" className="border border-black p-2">Transport Charges</td>
              <td className="border border-black p-2">
                <input
                  type="number"
                  value={transportCharges}
                  onChange={handleTransportChargesChange}
                  className="w-full text-center bg-transparent border-none focus:outline-none"
                />
              </td>
            </tr>
            <tr className="text-black font-bold" style={{ color: '#FF0000' }}>
              <td colSpan="4" className="border border-black p-2">Total</td>
              <td className="border border-black p-2">
                <input
                  type="number"
                  value={subtotal}
                  onChange={handleSubtotalChange}
                  className="w-full text-center bg-transparent border-none focus:outline-none"
                />
              </td>
            </tr>
            <tr className="text-black font-bold">
              <td colSpan="4" className="border border-black p-2">GST 5%</td>
              <td className="border border-black p-2">
                <input
                  type="number"
                  value={gst}
                  onChange={handleGstChange}
                  className="w-full text-center bg-transparent border-none focus:outline-none"
                />
              </td>
            </tr>
            <tr className="text-black font-bold" style={{ color: '#FF0000' }} >
              <td colSpan="4" className="border border-black p-2">GRAND TOTAL</td>
              <td className="border border-black p-2">
                <input
                  type="number"
                  value={totalAmount}
                  onChange={handleTotalAmountChange}
                  className="w-full text-center bg-transparent border-none focus:outline-none"
                />
              </td>
            </tr>
            <tr className="text-black font-bold">
              <td colSpan="4" className="border border-black p-2">ADVANCE AMOUNT</td>
              <td className="border border-black p-2">
                <input
                  type="number"
                  value={advance}
                  onChange={handleAdvanceChange}
                  className="w-full text-center bg-transparent border-none focus:outline-none"
                />
              </td>
            </tr>
            <tr className="text-black font-bold">
              <td colSpan="4" className="border border-black p-2">BALANCE AMOUNT</td>
              <td className="border border-black p-2">₹{balance}</td>
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