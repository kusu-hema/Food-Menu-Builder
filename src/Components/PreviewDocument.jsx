import React from 'react';

const PreviewDocument = React.forwardRef(
  ({ menuContexts, onRemoveItem, onRemoveContext }, ref) => {
    // Format date as "07-August-2025"
    const formatDate = (dateStr) => {
      if (!dateStr) return '';
      const date = new Date(dateStr);
      const day = String(date.getDate()).padStart(2, '0');
      const month = date.toLocaleString('en-US', { month: 'long' });
      const year = date.getFullYear();
      return `${day}-${month}-${year}`;
    };

    return (
      <div
        ref={ref}
        className="max-w-4xl mx-auto bg-white p-6 text-black font-serif border border-black print:border-none"
      >
        {/* Header */}
        <h2 className="Mainheading  text-center text-xl text-900 font-bold font-extrabold uppercase mb-2 text-[#FFC100]">
          SHAMMUKHA CATERERS PVT. LTD
       </h2>
        <h4 className="text-center text-sm text-gray-700 mb-1 break-words ">
          <span className="block sm:inline text-[#00B254]">
            An ISO 22000:2018 CERTIFIED COMPANY, Visit : 
          </span>{' '}
          <a
            href="https://www.shammukhacaterers.co.in"
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

        {/* Context Blocks */}
        {menuContexts.map((entry, index) => (
          <div
            key={index}
            className="mb-8 relative border border-black p-4 bg-white"
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
            {/* <h4 className="menuheaing text-lg font-black uppercase text-neutral-900 mb-4">
              {formatDate(entry.date)} {entry.meal?.toUpperCase()} FOR {entry.members} MEMBERS {entry.buffet}
            </h4> */}

            <h4 className="menuheading text-lg font-black uppercase text-neutral-900 mb-4">
              {formatDate(entry.date)} {entry.meal?.toUpperCase()} FOR {entry.members} MEMBERS{' '}
              <span className="text-[#FF0000]">{entry.buffet?.toUpperCase()}</span>
            </h4>
  

            {/* Category Table */}
            <table className="w-full text-sm border border-black">
              <tbody>
                {Object.entries(entry.items).map(([category, items]) => (
                  <tr key={category} className="border-b border-black align-top">
                    {/* Category Name */}
                    <td className="menuheaing p-2 font-bold text-black w-1/3 text-lg font-black  uppercase border-r border-black " >
                      {category}
                    </td>

                    {/* Items Inline */}
                    <td className="p-2 text-black w-2/3 uppercase flex flex-wrap gap-2">
                      {items.map((item, i) => (
                        <span
                          key={i}
                          className="inline-flex items-center gap-1 bg-white px-2 py-1"
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    );
  }
);

export default PreviewDocument;