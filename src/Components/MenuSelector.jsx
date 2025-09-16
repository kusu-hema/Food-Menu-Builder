import React from 'react';

function MenuSelector({ context, onChange }) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-4">
      <input
        type="date"
        value={context.date}
        onChange={(e) => onChange('date', e.target.value)}
        className="border rounded px-2 py-1"
      />
      <select
        value={context.meal}
        onChange={(e) => onChange('meal', e.target.value)}
        className="border rounded px-2 py-1"
      >
        <option value="">Select Meal</option>
        <option value="Breakfast">Breakfast</option>
        <option value="Lunch">Lunch</option>
        {/* <option value="Tiffin">Tiffin</option> */}
        <option value="Snacks">Snacks</option>
        <option value="Dinner">Dinner</option>
      </select>
      <input
        type="number"
        value={context.members}
        onChange={(e) => onChange('members', e.target.value)}
        className="border rounded px-2 py-1"
        placeholder="Members"
        min="1"
      />
      <select
      Value={context.buffet}
      onChange={(e) => onChange('buffet', e.target.value)}
      className='border rounded px-2 py-1 '
      >
        <option value=" ">Buf/Seat</option>
        <option value="Buffet">Buffet</option>
        <option value="SITTING">Sitting</option>
      </select>
    </div>
  );
}

export default MenuSelector;