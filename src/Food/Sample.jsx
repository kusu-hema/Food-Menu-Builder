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
