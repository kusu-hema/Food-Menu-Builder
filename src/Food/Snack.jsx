import React, { useState } from 'react';

function SnackTable({ snacks, onDelete, onUpdate }) {
  const [editingId, setEditingId] = useState(null);
  const [newName, setNewName] = useState('');

  const startEdit = (snack) => {
    setEditingId(snack.id);
    setNewName(snack.name);
  };

  const saveEdit = () => {
    onUpdate(editingId, newName);
    setEditingId(null);
    setNewName('');
  };

  return (
    <table border="1" cellPadding="8" width="100%">
      <thead>
        <tr>
          <th>ID</th>
          <th>Snack Name</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {snacks.map((snack) => (
          <tr key={snack.id}>
            <td>{snack.id}</td>
            <td>
              {editingId === snack.id ? (
                <input
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                />
              ) : (
                snack.name
              )}
            </td>
            <td>
              {editingId === snack.id ? (
                <button onClick={saveEdit}>Save</button>
              ) : (
                <button onClick={() => startEdit(snack)}>Edit</button>
              )}
              <button onClick={() => onDelete(snack.id)}>Delete</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default SnackTable;
