import React, { useState } from 'react';
import Food from './Food/Food';
import Snack from './Food/Snack';
import './App.css';

function App() {
  const [selectedSnacks, setSelectedSnacks] = useState([]);

  const addSnack = (snack) => {
    const exists = selectedSnacks.find((item) => item.id === snack.id);
    if (!exists) {
      setSelectedSnacks([...selectedSnacks, snack]);
    }
  };

  const deleteSnack = (id) => {
    setSelectedSnacks(selectedSnacks.filter((snack) => snack.id !== id));
  };

  const updateSnack = (id, newName) => {
    setSelectedSnacks(
      selectedSnacks.map((snack) =>
        snack.id === id ? { ...snack, name: newName } : snack
      )
    );
  };

  return (
    <div style={{ display: 'flex' }}>
      <div style={{ width: '50%', padding: '10px' }}>
        <h2>🍴 Available Snacks</h2>
        <Food onAdd={addSnack} />
      </div>
      <div style={{ width: '50%', padding: '10px' }}>
        <h2>📝 Selected Snacks</h2>
        <Snack
          snacks={selectedSnacks}
          onDelete={deleteSnack}
          onUpdate={updateSnack}
        />
      </div>
    </div>
  );
}

export default App;









// import React, { useEffect, useState } from 'react';

// function App() {
//   const [users, setUsers] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     fetch('http://localhost:4000/')
//       .then((res) => {
//         if (!res.ok) {
//           throw new Error('Failed to fetch users');
//         }
//         return res.json();
//       })
//       .then((data) => {
//         setUsers(data);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error('Error fetching users:', err);
//         setError(err.message);
//         setLoading(false);
//       });
//   }, []);

//   return (
//     <div style={{ padding: '30px', fontFamily: 'Arial' }}>
//       <h2>User List from PostgreSQL</h2>

//       {loading ? (
//         <p>Loading users...</p>
//       ) : error ? (
//         <p style={{ color: 'red' }}>❌ {error}</p>
//       ) : users.length === 0 ? (
//         <p>No users found.</p>
//       ) : (
//         <table
//           border="1"
//           cellPadding="10"
//           cellSpacing="0"
//           style={{ borderCollapse: 'collapse', marginTop: '20px', width: '100%' }}
//         >
//           <thead style={{ backgroundColor: '#f0f0f0' }}>
//             <tr>
//               <th>ID</th>
//               <th>Name</th>
//               <th>Email</th>
//               {/* Uncomment below if you want to show password */}
//               {/* <th>Password</th> */}
//             </tr>
//           </thead>
//           <tbody>
//             {users.map((user) => (
//               <tr key={user.id || user.email}>
//                 <td>{user.id}</td>
//                 <td>{user.name}</td>
//                 <td>{user.email}</td>
//                 {/* <td>{user.password}</td> */}
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       )}
//     </div>
//   );
// }

// export default App;












//  import React from 'react';

// const PreviewDocument = React.forwardRef(
//   ({ menuContexts, onRemoveItem, onRemoveContext, formData }, ref) => {
//     const formatDate = (dateStr) => {
//       if (!dateStr) return '';
//       const date = new Date(dateStr);
//       const day = String(date.getDate()).padStart(2, '0');
//       const month = date.toLocaleString('en-US', { month: 'short' }).toUpperCase();
//       const year = date.getFullYear();
//       return `${day}-${month}-${year}`;
//     };

//     const pricingMap = {
//       BREAKFAST: 200,
//       LUNCH: 600,
//       EVENING_SNACKS: 200,
//       DINNER: 400,
//     };

//     const invoiceRows = menuContexts.map((ctx, i) => {
//       const meal = ctx.meal?.toUpperCase();
//       const members = parseInt(ctx.members) || 0;
//       const price = pricingMap[meal] || 0;
//       const total = members * price;
//       return {
//         sno: i + 1,
//         event: `${formatDate(ctx.date)} ${meal}`,
//         members,
//         price,
//         total,
//       };
//     });

//     const subtotal = invoiceRows.reduce((sum, row) => sum + row.total, 0);
//     const gst = Math.round(subtotal * 0.10);
//     const totalAmount = subtotal + gst;
//     const advance = 50000;
//     const balance = totalAmount - advance;

//     return (
//       <div
//         ref={ref}
//         className="max-w-4xl mx-auto bg-white p-6 text-black font-serif border border-black print:border-none"
//       >
//         {/* Header */}
//         <h2 className="text-center text-xl font-extrabold uppercase mb-2 text-[#FFC100]">
//           SHAMMUKHA CATERERS PVT. LTD
//         </h2>
//         <h4 className="text-center text-sm text-gray-700 mb-1 break-words">
//           <span className="block sm:inline text-[#00B254]">
//             An ISO 22000:2018 CERTIFIED COMPANY, Visit :
//           </span>{' '}
//           <a
//             href="https://www.shanmukhacaterers.co.in/"
//             target="_blank"
//             rel="noreferrer"
//             className="text-blue-600 hover:underline block sm:inline underline-offset-2"
//           >
//             www.shanmukhacaterers.co.in
//           </a>
//         </h4>
//         <h4 className="text-center text-sm text-gray-700 mb-4">
//           VIDYA NAGAR, HYDERABAD - 500 044 | CUSTOMER CARE: 1800 890 3081.
//         </h4>
//         <h3 className="text-center font-black uppercase text-base mb-6 text-[#00B254]">
//           WE CATER TO YOUR HEALTH
//         </h3>

//         {/* Customer Details */}
//         <div className="mb-4 text-sm font-medium text-black flex flex-wrap justify-between uppercase">
//           <div className="w-full md:w-[48%]">
//             <div className="mb-1">
//               <span style={{ fontWeight: '900', fontSize: 'larger' }}>Name:</span> {formData.name}
//             </div>
//             <div className="mb-1">
//               <span style={{ fontWeight: '900', fontSize: 'larger' }}>Contact:</span> {formData.contact}
//             </div>
//           </div>
//           <div className="w-full md:w-[48%]">
//             <div className="mb-1">
//               <span style={{ fontWeight: '900', fontSize: 'larger' }}>Date:</span> {formatDate(formData.date)}
//             </div>
//             <div className="mb-1">
//               <span style={{ fontWeight: '900', fontSize: 'larger' }}>Place:</span> {formData.place}
//             </div>
//           </div>
//         </div>

//         {/* Menu Contexts */}
//         {menuContexts.map((entry, index) => (
//           <div key={index} className="mb-8 relative border border-black p-2 bg-white print:no-border">
//             <button
//               onClick={() => {
//                 const confirmDelete = window.confirm('Are you sure you want to delete this menu context?');
//                 if (confirmDelete) {
//                   onRemoveContext(index);
//                 }
//               }}
//               className="absolute top-2 right-2 text-red-600 text-sm border border-gray-300 rounded px-2 py-0.5 hover:bg-red-50 transition print:hidden"
//               title="Remove entire menu context"
//             >
//               ❌
//             </button>

//             <h4
//               style={{
//                 fontWeight: 900,
//                 fontSize: 'larger',
//                 textTransform: 'uppercase',
//                 color: '#1a1a1a',
//                 marginBottom: '1rem',
//                 letterSpacing: '1.3px',
//               }}
//             >
//               {formatDate(entry.date)} {entry.meal?.toUpperCase()} FOR {entry.members} MEMBERS{' '}
//               <span style={{ color: '#FF0000' }}>{entry.buffet?.toUpperCase()}</span>
//             </h4>

//             <table className="w-full text-sm border border-black">
//               <tbody>
//                 {Object.entries(entry.items).map(([category, items]) => (
//                   <tr key={category} className="border-b border-black align-top">
//                     <td className="p-2 font-bold text-black w-1/4 text-base uppercase border-r border-black">
//                       {category}
//                     </td>
//                     <td className="p-1 font-bold text-base text-black w-2/3 uppercase">
//                       <div className="flex flex-wrap gap-x-4 gap-y-1">
//                         {items.map((item, i) => (
//                           <span key={i} className="inline-flex items-center gap-1">
//                             * {item}
//                             <button
//                               onClick={() => onRemoveItem(index, category, item)}
//                               className="text-red-600 text-xs border border-gray-300 rounded px-1 py-0.5 hover:bg-red-50 transition print:hidden"
//                               title="Remove item"
//                             >
//                               ❌
//                             </button>
//                           </span>
//                         ))}
//                       </div>
//                     </td>
//                   </tr>
//                 ))}
//               </tbody>
//             </table>
//           </div>
//         ))}

//         {/* Invoice Table */}
//         <table className="w-full text-sm border border-black mt-6">
//           <thead>
//             <tr className="bg-[#FFC100] text-black font-bold text-center">
//               <th className="border border-black p-2">SNO</th>
//               <th className="border border-black p-2">EVENT</th>
//               <th className="border border-black p-2">MEMBERS</th>
//               <th className="border border-black p-2">PRICE</th>
//               <th className="border border-black p-2">TOTAL</th>
//             </tr>
//           </thead>
//           <tbody>
//             {invoiceRows.map((row, i) => (
//               <tr key={i} className="text-center text-black font-semibold">
//                 <td className="border border-black p-2">{row.sno}</td>
//                 <td className="border border-black p-2">{row.event}</td>
//                 <td className="border border-black p-2">{row.members}</td>
//                 <td className="border border-black p-2">₹{row.price}</td>
//                 <td className="border border-black p-2">₹{row.total}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>

//         {/* Totals */}
//         <div className="text-right mt-4 text-base font-bold text-black">
//           <div>SUB TOTAL: ₹{subtotal}</div>
//           <div>GST 10%: ₹{gst}</div>
//           <div>TOTAL AMOUNT: ₹{totalAmount}</div>
//           <div>ADVANCE AMOUNT: ₹{advance}</div>
//           <div>BALANCE AMOUNT: ₹{balance}</div>
//         </div>

//         {/* Footer */}
//         <div className="mt-8 text-center text-sm italic">
//           NOTE: ADDITIONAL AMOUNT WILL BE CHARGED FOR EXTRA PLATES
//         </div>
//         <div className="mt-6 text-right font-bold">
//           Manager,<br />
//           SHAMMUKHA CATERERS PVT. LTD
//         </div>
//       </div>
//     );
//   }
// );

