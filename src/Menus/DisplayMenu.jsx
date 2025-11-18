import React, { useState } from 'react';
import Preview from '../MenuEdit/Preview'; // adjust path as needed

const dummyMenuContexts = [
  {
    date: '2025-11-18',
    meal: 'BREAKFAST',
    members: '10',
    buffet: 'VEG',
    items: {
      'Appetizers': ['Samosa', 'Paneer Tikka'],
      'Main Course': ['Paneer Butter Masala', 'Dal Fry'],
    },
  },
  {
    date: '2025-11-19',
    meal: 'LUNCH',
    members: '15',
    buffet: 'NON-VEG',
    items: {
      'Starters': ['Chicken 65', 'Fish Fry'],
      'Main Course': ['Butter Chicken', 'Jeera Rice'],
    },
  },
];

const dummyFormData = {
  name: 'John Doe',
  contact: '9876543210',
  date: '2025-11-18',
  place: 'Hyderabad',
};

export default function PreviewDemo() {
  const [menuContexts, setMenuContexts] = useState(dummyMenuContexts);
  const [formData, setFormData] = useState(dummyFormData);

  // No-op handlers for remove item/context as demo
  const onRemoveItem = () => {};
  const onRemoveContext = () => {};
  const onInvoiceDataChange = (data) => {
    console.log('Invoice Data Changed', data);
  };

  return (
    <div style={{ padding: '1rem', backgroundColor: '#eee', minHeight: '100vh' }}>
      <Preview
        menuContexts={menuContexts}
        onRemoveItem={onRemoveItem}
        onRemoveContext={onRemoveContext}
        formData={formData}
        onInvoiceDataChange={onInvoiceDataChange}
      />
    </div>
  );
}
