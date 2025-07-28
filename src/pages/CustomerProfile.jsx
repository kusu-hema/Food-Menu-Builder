import React from 'react';

function CustomerProfile() {
  const customer = {
    name: "Anjali Devi",
    avatar: "https://i.pravatar.cc/100?img=5", 
    email: "anjali.devi@example.com",
    phone: "+91 98765 43210",
    events: [
      {
        date: "2025-07-26",
        type: "Birthday Party",
        address: "Lotus Banquet Hall, Hyderabad",
        amount: 12500
      },
      {
        date: "2025-08-02",
        type: "Engagement",
        address: "Green Leaf Gardens, Secunderabad",
        amount: 22500
      },
      {
        date: "2025-09-10",
        type: "Reception",
        address: "Raintree Palace, Gachibowli",
        amount: 30000
      }
    ]
  };

  return (
    <div className="w-full p-4 sm:p-6 md:p-8 bg-white rounded-lg shadow-md max-w-5xl mx-auto">
      <h2 className="text-xl sm:text-2xl font-bold mb-4">Hi, {customer.name}</h2>

      <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-6">
        <img
          src={customer.avatar}
          alt="Profile"
          className="w-20 h-20 rounded-full object-cover border"
        />
        <div>
          <p className="text-sm sm:text-base text-gray-700">{customer.email}</p>
          <p className="text-sm sm:text-base text-gray-700">{customer.phone}</p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table-auto w-full border border-gray-200 text-sm sm:text-base">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 text-left">Date</th>
              <th className="p-2 text-left">Type</th>
              <th className="p-2 text-left">Location</th>
              <th className="p-2 text-left">Amount</th>
            </tr>
          </thead>
          <tbody>
            {customer.events.map((event, index) => (
              <tr key={index} className="border-t">
                <td className="p-2">{event.date}</td>
                <td className="p-2">{event.type}</td>
                <td className="p-2">{event.address}</td>
                <td className="p-2">₹ {event.amount.toLocaleString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default CustomerProfile;
