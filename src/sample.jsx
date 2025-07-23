import React, { useState, useRef } from 'react';
import { useReactToPrint } from 'react-to-print';

// internal pages
import PreviewDocument from './Components/PreviewDocument';
import MenuSelector from './Components/MenuSelector';
import MenuItems from './Components/MenuItems';
import menuData from './Data/Data';


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

  const [category, setCategory] = useState('Tiffin');
  const [selectedItems, setSelectedItems] = useState({
    Tiffin: [],
    Lunch: [],
    Dinner: [],
  });

  const handleAdd = (item) => {
    if (!selectedItems[category].includes(item)) {
      setSelectedItems({
        ...selectedItems,
        [category]: [...selectedItems[category], item],
      });
    }
  };

  const handleRemove = (category, item) => {
    setSelectedItems((prev) => ({
      ...prev,
      [category]: prev[category].filter((i) => i !== item),
    }));
  };

  return (
    <div style={{ display: 'flex', height: '100vh' }}>
      
      <div style={{ width: '40%', padding: '20px' }}>
        <MenuSelector selected={category} onSelect={setCategory} />
        <MenuItems
          items={menuData[category]}
          onAdd={handleAdd}
          selectedItems={selectedItems[category]}
        />
      </div>

      <div style={{ width: '60%', padding: '20px', background: '#f9f9f9' }}>
        <button onClick={handlePrint}>Print Invoice</button>

        <div style={{ marginTop: '20px' }}>
          <PreviewDocument
            ref={componentRef}
            selectedItems={selectedItems}
            onRemove={handleRemove}
          />
        </div>
      </div>

    </div>
  );
}

export default App;









// //api integration 
// import React, { useEffect, useState } from 'react';

// function App() {
//   const [users, setUsers] = useState([]);

//   useEffect(() => {
//     fetch('http://localhost:4000/') // Make sure your backend returns customer data here
//       .then(res => res.json())
//       .then(data => {
//         console.log('Fetched customers:', data);
//         setUsers(data);
//       })
//       .catch(err => {
//         console.error('Error fetching customers:', err);
//       });
//   }, []);

//   return (
//     <div>
//       <h2>Customer List</h2>
//       <table border="1" cellPadding="8">
//         <thead>
//           <tr>
//             <th>ID</th>
//             <th>Name</th>
//             <th>Phone</th>
//             <th>Start</th>
//             <th>End</th>
//             <th>Type</th>
//             <th>Location</th>
//             <th>Status</th>
//           </tr>
//         </thead>
//         <tbody>
//           {users.length === 0 ? (
//             <tr><td colSpan="8">No customers found.</td></tr>
//           ) : (
//             users.map((user, index) => (
//               <tr key={index}>
//                 <td>{user.id}</td>
//                 <td>{user.name}</td>
//                 <td>{user.phone}</td>
//                 <td>{user.start}</td>
//                 <td>{user.end}</td>
//                 <td>{user.type}</td>
//                 <td>{user.location}</td>
//                 <td>{user.status}</td>
//               </tr>
//             ))
//           )}
//         </tbody>
//       </table>
//     </div>
//   );
// }

// export default App;




 
 
