// import React, { useState } from 'react';
// import MenuSelector from './Components/MenuSelector';
// import MenuItems from './Components/MenuItems';
// import PreviewDocument from './Components/PreviewDocument';
// import menuData from './Data/Data';

// function App() {
//   const [category, setCategory] = useState('Tiffin');
//   const [selectedItems, setSelectedItems] = useState([]);

//   const handleAdd = (item) => {
//     if (!selectedItems.includes(item)) {
//       setSelectedItems([...selectedItems, item]);
//     }
//   };

//   const handleRemove = (item) => {
//     setSelectedItems(selectedItems.filter((i) => i !== item));
//   };

//   return (
//     <div style={{ display: 'flex', height: '100vh' }}>
//       <div style={{ width: '50%', padding: '20px' }}>
//         <MenuSelector selected={category} onSelect={setCategory} />
//         <MenuItems
//           items={menuData[category]}
//           onAdd={handleAdd}
//           selectedItems={selectedItems}
//         />
//       </div>
//       <div style={{ width: '50%', padding: '20px', background: '#f9f9f9' }}>
//         <PreviewDocument category={category} items={selectedItems} onRemove={handleRemove} />
//       </div>
//     </div>
//   );
// }

// export default App;





import React, { useEffect, useState } from 'react';

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('http://localhost:4000/')
      .then((res) => {
        if (!res.ok) {
          throw new Error('Failed to fetch users');
        }
        return res.json();
      })
      .then((data) => {
        setUsers(data);
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching users:', err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  return (
    <div style={{ padding: '30px', fontFamily: 'Arial' }}>
      <h2>User List from PostgreSQL</h2>

      {loading ? (
        <p>Loading users...</p>
      ) : error ? (
        <p style={{ color: 'red' }}>❌ {error}</p>
      ) : users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        <table
          border="1"
          cellPadding="10"
          cellSpacing="0"
          style={{ borderCollapse: 'collapse', marginTop: '20px', width: '100%' }}
        >
          <thead style={{ backgroundColor: '#f0f0f0' }}>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Email</th>
              {/* Uncomment below if you want to show password */}
              {/* <th>Password</th> */}
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id || user.email}>
                <td>{user.id}</td>
                <td>{user.name}</td>
                <td>{user.email}</td>
                {/* <td>{user.password}</td> */}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default App;
