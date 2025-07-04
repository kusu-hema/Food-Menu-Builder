import React from 'react';

const snackList = [
  { id: 1, name: 'Samosa' },
  { id: 2, name: 'Pani Puri' },
  { id: 3, name: 'Pakora' },
  { id: 4, name: 'Vada Pav' },
  { id: 5, name: 'Dhokla' },
];

function FoodList({ onAdd }) {
  return (
    <div>
      {snackList.map((snack) => (
        <div
          key={snack.id}
          style={{
            margin: '10px',
            padding: '10px',
            border: '1px solid #ccc',
            cursor: 'pointer',
          }}
          onClick={() => onAdd(snack)}
        >
          🍽️ {snack.name}
        </div>
      ))}
    </div>
  );
}

export default FoodList;
