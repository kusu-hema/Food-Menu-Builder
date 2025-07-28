import React from 'react';

const PreviewDocument = React.forwardRef(({ selectedItems, onRemove }, ref) => (
  <div
    ref={ref}
    className="max-w-4xl mx-auto bg-white shadow-lg rounded-lg p-6 text-gray-900 font-sans border border-gray-300"
  >
    <h2 className="text-center text-xl font-bold uppercase mb-2">SHANMUKHA CATERERS PVT. LTD</h2>
          <h4 className="text-center text-sm text-gray-600 mb-1 break-words">
        <span className="block sm:inline">An ISO 22000:2018 CERTIFIED COMPANY</span>{' '}
        <span className="block sm:inline"></span>{' '}
        <a
          href="https://www.shanmukhacaterers.co.in/"
          target="_blank"
          rel="noreferrer"
          className="text-blue-500 hover:underline block sm:inline"
        >
          www.shanmukhacaterers.co.in
        </a>
      </h4>

    <h4 className="text-center text-sm text-gray-600 mb-4">
      VIDYA NAGAR, HYDERABAD - 500 044 | CUSTOMER CARE: 1800 8903781
    </h4>
    <h3 className="text-center font-bold uppercase text-base mb-6">WE CATER TO YOUR HEALTH</h3>

    <div className="flex flex-wrap justify-between text-sm mb-4">
      <p><strong>DATE:</strong> 22.06.2025</p>
      <p><strong>PLACE:</strong> Vidya Nagar</p>
    </div>

    <div className="text-sm mb-4 space-y-1">
      <p><strong>NAME:</strong> Anu</p>
      <p><strong>CONTACT:</strong> +91 xxxxxxxxx</p>
      <p><strong>FOR:</strong> 100 MEMBERS</p>
    </div>

    {['Tiffin', 'Lunch', 'Dinner'].map((category) => (
      <div key={category} className="mb-4">
        <div className="text-lg font-semibold text-gray-800 border-b pb-1 mb-2">
          {category.toUpperCase()}
        </div>
        {selectedItems[category].length === 0 ? (
          <p className="italic text-gray-400">No items selected.</p>
        ) : (
          <div className="flex flex-wrap gap-x-6 gap-y-2 text-base leading-loose">
            {selectedItems[category].map((item) => (
              <span key={item} className="inline-flex items-center space-x-2">
                <span>* {item}</span>
                <button
                  onClick={() => onRemove(category, item)}
                  className="text-red-600 text-sm border border-gray-300 rounded px-2 py-0.5 hover:bg-red-50 transition"
                  title="Remove item"
                >
                  ❌
                </button>
              </span>
            ))}
          </div>
        )}
      </div>
    ))}
  </div>
));

export default PreviewDocument;
