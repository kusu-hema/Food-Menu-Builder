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

