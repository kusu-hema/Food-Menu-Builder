import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

// =========================================================
//  UTILITY FUNCTIONS - MUST BE DEFINED
// =========================================================

// Utility function to format the ISO date string into a readable local date
const formatDate = (isoString) => {
    if (!isoString) return 'N/A';
    try {
        const dateObj = new Date(isoString);
        
        // Check if the date object is valid
        if (isNaN(dateObj.getTime())) {
            return 'Invalid Date Format';
        }
        
        // Format to a readable local date string (e.g., Nov 19, 2025)
        return dateObj.toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            // Use UTC to prevent local timezone shift issues that can break Date()
            timeZone: 'UTC' 
        });
    } catch (e) {
        return 'Invalid Date';
    }
};

// Utility function to safely parse and display currency, ensuring 0.00 is shown.
const formatCurrency = (valueString) => {
    // Check for null/undefined strings
    if (valueString === null || valueString === undefined || valueString === '') {
        return '0.00';
    }
    
    // Safely parse the string (e.g., "560000.00") to a floating-point number
    const number = parseFloat(valueString);

    if (isNaN(number)) {
        return '0.00'; // Fallback if the string is corrupted
    }
    
    // Always format to two decimal places
    return number.toFixed(2);
};

// =========================================================
// 🚀 DISPLAY MENU COMPONENT
// =========================================================

const DisplayMenu = () => {
    // 💡 IMPORTANT: This URL should match the complex join endpoint
    const { id } = useParams();
    const [menu, setMenu] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // 💡 CRITICAL: Ensure the correct details endpoint is used here
        axios
          .get(`http://localhost:4000/api/menus/details/${id}`)
          .then((res) => {
            setMenu(res.data);
          })
          .catch((err) => {
            console.error("Error fetching menu:", err);
            setError(`Failed to fetch menu details. ${err.response?.data?.message || err.message}`);
          })
          .finally(() => {
            setLoading(false);
          });
    }, [id]);

    if (loading) return <p className="p-6 text-lg">Loading invoice...</p>;
    if (error) return <p className="p-6 text-lg text-red-600">Error: {error}</p>;
    if (!menu) return <p className="p-6 text-lg text-red-600">Invoice not found.</p>;

    // Destructuring fields for clarity
    const {
        customer_name, contact, place, booking_date,
        subtotal, gst, grand_total, advance, balance,
        lead_counters, water_bottles, cooking_charges, labour_charges, transport_charges,
        menu_contexts
    } = menu;


    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold mb-6">Invoice Details</h2>

            {/* Main Card */}
            <div className="bg-white shadow-xl p-8 rounded-xl space-y-6">

                {/* Client Details */}
                <section>
                    <h3 className="text-xl font-bold mb-3">Client Information</h3>
                    <p><strong>Client Name:</strong> {customer_name}</p>
                    <p><strong>Phone:</strong> {contact}</p>
                    <p><strong>Place:</strong> {place}</p>
                    <p>
                        <strong>Booking Date:</strong>{" "}
                        {/* 📅 FIX APPLIED: Use formatDate utility */}
                        {formatDate(booking_date)}
                    </p>
                </section>

                <hr />

                {/* Invoice */}
                <section>
                    <h3 className="text-xl font-bold mb-3">Invoice Summary</h3>
                    {/* 💰 FIXES APPLIED: Use formatCurrency utility */}
                    <p><strong>Subtotal:</strong> ₹{formatCurrency(subtotal)}</p>
                    <p><strong>GST:</strong> ₹{formatCurrency(gst)}</p>
                    <p><strong>Grand Total:</strong> ₹{formatCurrency(grand_total)}</p>
                    <p><strong>Advance Paid:</strong> ₹{formatCurrency(advance)}</p>
                    <p><strong>Balance:</strong> ₹{formatCurrency(balance)}</p>
                </section>

                <hr />

                {/* Extra Charges */}
                <section>
                    <h3 className="text-xl font-bold mb-3">Additional Charges</h3>
                    {/* 💰 FIXES APPLIED: Ensure numerical fields are treated as currency */}
                    <p><strong>Lead Counters:</strong> {formatCurrency(lead_counters)}</p>
                    <p><strong>Water Bottles:</strong> {formatCurrency(water_bottles)}</p>
                    <p><strong>Cooking Charges:</strong> ₹{formatCurrency(cooking_charges)}</p>
                    <p><strong>Labour Charges:</strong> ₹{formatCurrency(labour_charges)}</p>
                    <p><strong>Transport Charges:</strong> ₹{formatCurrency(transport_charges)}</p>
                </section>

                <hr />

                {/* Menu Contexts */}
                <section>
                    <h3 className="text-xl font-bold mb-3">Menu Items</h3>

                    {/* Check if menu_contexts exists before mapping */}
                    {menu_contexts?.length > 0 ? (
                        menu_contexts.map((ctx, idx) => (
                            <div key={idx} className="bg-gray-50 p-4 rounded-lg mb-4">
                                <p><strong>Event Date:</strong> {ctx.event_date}</p>
                                <p><strong>Meal:</strong> {ctx.meal}</p>
                                <p><strong>Members:</strong> {ctx.members}</p>
                                {/* Note: Assuming Buffet field is a string or boolean handled by the backend */}
                                <p><strong>Buffet:</strong> {ctx.buffet === true || ctx.buffet === "true" ? "Yes" : "No"}</p>

                                <div className="mt-3">
                                    {/* Check if categories exists before mapping */}
                                    {ctx.categories?.length > 0 ? (
                                        ctx.categories.map((cat, cIdx) => (
                                            <div key={cIdx} className="mb-3">
                                                <h4 className="text-lg font-semibold text-indigo-700">
                                                    {cat.category_name}
                                                </h4>

                                                <ul className="list-disc ml-6 text-gray-700">
                                                    {/* Check if items exists before mapping */}
                                                    {cat.items?.map((item, iIdx) => (
                                                        <li key={iIdx}>{item}</li>
                                                    ))}
                                                </ul>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500">No categories defined for this meal.</p>
                                    )}
                                </div>
                            </div>
                        ))
                    ) : (
                        <p className="text-gray-500">No menu contexts defined for this invoice.</p>
                    )}
                </section>
            </div>
        </div>
    );
};

export default DisplayMenu;
