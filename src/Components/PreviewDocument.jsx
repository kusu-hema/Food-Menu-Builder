import React from 'react';

const PreviewDocument = React.forwardRef(({ menuContexts, onRemoveItem, onRemoveContext }, ref) => (
  <div
    ref={ref}
    className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6 text-gray-900 font-sans border border-gray-300"
  >
    {/* Header */}
    <h2 className="text-center text-xl font-bold uppercase mb-2">SHAMMUKHA CATERERS PVT. LTD</h2>
    <h4 className="text-center text-sm text-gray-600 mb-1 break-words">
      <span className="block sm:inline">An ISO 22000:2018 CERTIFIED COMPANY</span>{' '}
      <a
        href="https://www.shammukhacaterers.com"
        target="_blank"
        rel="noreferrer"
        className="text-blue-500 hover:underline block sm:inline"
      >
        www.shammukhacaterers.com
      </a>
    </h4>
    <h4 className="text-center text-sm text-gray-600 mb-4">
      VIDYA NAGAR, HYDERABAD - 500 044 | CUSTOMER CARE: 1800 8903081
    </h4>
    <h3 className="text-center font-bold uppercase text-base mb-6">WE CATER TO YOUR HEALTH</h3>

    {/* Context Blocks */}
    {menuContexts.map((entry, index) => (
      <div key={index} className="mb-8 relative border rounded-lg p-4 shadow bg-white">
        {/* Remove Context Button */}
        <button
          onClick={() => onRemoveContext(index)}
          className="absolute top-2 right-2 text-red-600 text-sm border border-gray-300 rounded px-2 py-0.5 hover:bg-red-50 transition"
          title="Remove entire menu context"
        >
          ❌
        </button>

        {/* Context Header */}
        <h4 className="text-md font-bold text-gray-700 mb-2">
          {entry.date} {entry.meal?.toUpperCase()} FOR {entry.members} MEMBERS
        </h4>

        {/* Category Sections */}
        {Object.entries(entry.items).map(([category, items]) => (
          <div key={category} className="mb-4">
            <div className="text-lg font-semibold text-gray-800 border-b pb-1 mb-2">
              {category.toUpperCase()}
            </div>
            <ul className="list-disc ml-6 text-sm text-gray-700 space-y-1">
              {items.map((item, i) => (
                <li key={i} className="flex items-center justify-between">
                  <span>{item}</span>
                  <button
                    onClick={() => onRemoveItem(index, category, item)}
                    className="ml-4 text-red-600 text-xs border border-gray-300 rounded px-2 py-0.5 hover:bg-red-50 transition"
                    title="Remove item"
                  >
                    ❌
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    ))}
  </div>
));

export default PreviewDocument;