// import React, { useState } from 'react';
// import MenuSelector from './Components/MenuSelector';
// import MenuItems from './Components/MenuItems';
// import PreviewDocument from './Components/PreviewDocument';
// import menuData from './Data/Data';

// function App() {
//   const [category, setCategory] = useState('Tiffin');
//   const [selectedItems, setSelectedItems] = useState({
//     Tiffin: [],
//     Lunch: [],
//     Dinner: []
//   });


//   const handleAdd = (item) => {
//     if (!selectedItems[category].includes(item)) {
//       setSelectedItems({
//         ...selectedItems,
//         [category]: [...selectedItems[category], item]
//       });
//     }
//   };

//   // ✅ FIXED: Now accepts (category, item)
//   const handleRemove = (category, item) => {
//     setSelectedItems((prev) => ({
//       ...prev,
//       [category]: prev[category].filter((i) => i !== item)
//     }));
//   };

//   return (
//     <div style={{ display: 'flex', height: '100vh' }}>
//       <div style={{ width: '50%', padding: '20px' }}>
//         <MenuSelector selected={category} onSelect={setCategory} />
//         <MenuItems
//           items={menuData[category]}
//           onAdd={handleAdd}
//           selectedItems={selectedItems[category]}
//         />
//       </div>
//       <div style={{ width: '50%', padding: '20px', background: '#f9f9f9' }}>
//         <PreviewDocument
//           selectedItems={selectedItems}
//           onRemove={handleRemove} // ✅ Now matches usage
//         />
//       </div>
//     </div>
//   );
// }

// export default App;


 
import React, { useRef } from 'react';
import { useReactToPrint } from 'react-to-print';
import PrintableComponent from './Components/PrintableComponent';

function App() {
  const componentRef = useRef(null);

  const handlePrint = useReactToPrint({
    contentRef: componentRef,
    documentTitle: 'Invoice',
    pageStyle: `
      @page { margin: 20mm }
      body { font-family: Arial, sans-serif; }
    `,
  });

  return (
    <div>
      <button onClick={handlePrint}>Print Invoice</button>
      <div style={{ marginTop: '20px' }}>
        <PrintableComponent ref={componentRef} />
      </div>
    </div>
  );
}

export default App;

