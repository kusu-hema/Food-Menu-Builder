import React, { useState, useEffect, useRef } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { useReactToPrint } from 'react-to-print';
import MenuSelector from '../Components/MenuSelector';
import MenuItems from '../Components/MenuItems';
import Preview from '../MenuEdit/Preview';

const InvoiceEditor = () => {
    const { id } = useParams();
    const componentRef = useRef(null);

    const [isLoading, setIsLoading] = useState(true);
    const [isUpdating, setIsUpdating] = useState(false);
    const [error, setError] = useState(null);

    // STATE INITIALIZATION (Fetched Data)
    const [menuContexts, setMenuContexts] = useState([]);
    const [formData, setFormData] = useState({ date: '', place: '', name: '', contact: '' });
    const [invoiceData, setInvoiceData] = useState(null); 
    
    // UI States
    const [formExpanded, setFormExpanded] = useState(true);
    const [expandedIndex, setExpandedIndex] = useState(null);

    // Helper function to extract item names from nested structure for API payload
    const formatItemsForApi = (contexts) => {
        const items = [];
        contexts.forEach(context => {
            if (context.items) {
                Object.keys(context.items).forEach(category_name => {
                    context.items[category_name].forEach(item_name => {
                        items.push({
                            item_name,
                            category_name,
                            menu_context_id: context.id 
                        });
                    });
                });
            }
        });
        return items;
    };

    // -----------------------------------------------------------------
    // 1. DATA FETCHING EFFECT (Uses your existing logic)
    // -----------------------------------------------------------------
    useEffect(() => {
        const fetchFullMenuData = async () => {
            if (!id) return;

            try {
                // ... (Your existing fetching logic for initial state)
                // 1. Fetch Client Details (formData) and Invoice Totals (invoiceData)
                const [menuRes, invoiceRes] = await Promise.all([
                    axios.get(`http://localhost:4000/api/menus/${id}`),
                    axios.get(`http://localhost:4000/api/menuinvoice/by-menu/${id}`),
                ]);

                const menuData = menuRes.data;
                const invoiceData = invoiceRes.data[0] || null; 

                // Set Client Form Data
                setFormData({
                    date: menuData.date ? menuData.date.split('T')[0] : '',
                    place: menuData.place || '',
                    name: menuData.customer_name || '',
                    contact: menuData.contact || '',
                });

                // Set Invoice Totals Data
                setInvoiceData(invoiceData);

                // 2. Fetch Menu Contexts and Items
                const contextsRes = await axios.get(`http://localhost:4000/api/menucontext/by-menu/${id}`);
                const contexts = contextsRes.data;
                
                const itemsRes = await axios.get(`http://localhost:4000/api/menuitems/by-menu/${id}`);
                const allItems = itemsRes.data;

                const reconstructedContexts = contexts.map(context => {
                    const items = {};
                    
                    allItems
                        .filter(item => item.menu_context_id === context.id)
                        .forEach(item => {
                            const category = item.category_name;
                            if (!items[category]) {
                                items[category] = [];
                            }
                            // Use item_name here if MenuItems only stores names
                            items[category].push(item.item_name); 
                        });

                    return {
                        id: context.id, 
                        date: context.event_date ? context.event_date.split('T')[0] : '',
                        meal: context.meal || '',
                        members: context.members || '',
                        buffet: context.buffet || '',
                        items: items,
                    };
                });
                
                setMenuContexts(reconstructedContexts);
                setIsLoading(false);

            } catch (err) {
                console.error('Error fetching data for editing:', err);
                setError('Could not load the client data. Check server endpoints and ID.');
                setIsLoading(false);
            }
        };

        fetchFullMenuData();
    }, [id]);

    // -----------------------------------------------------------------
    // 2. UPDATE LOGIC: Submit all modified data to the backend
    // -----------------------------------------------------------------
    const handleUpdateAndPrint = async () => {
        if (isUpdating) return;
        setIsUpdating(true);
        setError(null);

        try {
            // 1. Update the main Menu/Client record (PUT /api/menus/:id)
            const menuPayload = {
                customer_name: formData.name,
                contact: formData.contact,
                date: formData.date, // Ensure format is YYYY-MM-DD for backend
                place: formData.place
            };
            await axios.put(`http://localhost:4000/api/menus/${id}`, menuPayload);

            // 2. Update Menu Contexts (PUT /api/menucontext/:id)
            // Note: Since contexts are small, we update them individually.
            const contextUpdates = menuContexts.map(context => {
                const contextPayload = {
                    event_date: context.date, 
                    meal: context.meal,
                    members: context.members,
                    buffet: context.buffet,
                };
                return axios.put(`http://localhost:4000/api/menucontext/${context.id}`, contextPayload);
            });
            await Promise.all(contextUpdates);

            // 3. Update Menu Items (Requires a dedicated efficient endpoint for replacement)
            // It's recommended that your backend handles replacement: DELETE all old items for this menu, then CREATE all new items.
            const allItems = formatItemsForApi(menuContexts);
            const itemsUpdatePayload = { menu_id: id, items: allItems };

            // IMPORTANT: This API call assumes a dedicated endpoint that handles **replacement**.
            // e.g., DELETE all old items where menu_id = :id, then INSERT new items.
            await axios.put(`http://localhost:4000/api/menuitems/replace-by-menu/${id}`, itemsUpdatePayload);


            // 4. Update Invoice Totals (PUT /api/menuinvoice/:id)
            // Find the correct ID for the invoice data record (assuming invoiceData holds the primary key)
            if (invoiceData && invoiceData.id) {
                // Clean up invoiceData payload to match your backend schema for PUT
                const invoicePayload = {
                    total_pax: invoiceData.total_pax,
                    rate_per_pax: invoiceData.rate_per_pax,
                    total_amount: invoiceData.total_amount,
                    gst_rate: invoiceData.gst_rate,
                    gst_amount: invoiceData.gst_amount,
                    final_total: invoiceData.final_total,
                    advance_paid: invoiceData.advance_paid,
                    balance_due: invoiceData.balance_due,
                    // menu_id is already implicitly known via the route ID, but include it if your API requires it
                    menu_id: id
                };
                await axios.put(`http://localhost:4000/api/menuinvoice/${invoiceData.id}`, invoicePayload);
            }


            alert('Invoice and Menu successfully updated!');
            // After successful update, initiate print
            handlePrint();

        } catch (err) {
            console.error('Error updating data:', err);
            setError('Failed to save changes. Check the network and server status.');
        } finally {
            setIsUpdating(false);
        }
    };


    // -----------------------------------------------------------------
    // 3. UI Helper Functions (Existing)
    // -----------------------------------------------------------------
    const updateContext = (index, field, value) => {
        const updated = [...menuContexts];
        updated[index][field] = value;
        setMenuContexts(updated);
    };

    const handleFormChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const toggleAccordion = (index) => {
        setExpandedIndex((prev) => (prev === index ? null : index));
    };

    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
        documentTitle: `Invoice_${formData.name}`,
    });

    // -----------------------------------------------------------------
    // 4. Render Logic
    // -----------------------------------------------------------------

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-xl text-indigo-600">Loading Invoice Data...</div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="flex items-center justify-center min-h-screen bg-gray-50">
                <div className="text-xl text-red-600 p-6 bg-white rounded-lg shadow-md">{error}</div>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="flex flex-col lg:flex-row gap-8 max-w-7xl mx-auto">
                
                {/* LEFT PANEL: Menu Builder */}
                <div className="w-full lg:w-2/5 xl:w-1/3 bg-white rounded-2xl shadow-xl p-6 border border-gray-100 sticky top-4 max-h-[calc(100vh-2rem)] overflow-y-auto">
                    <h2 className="text-2xl font-bold mb-6 text-gray-900 border-b pb-2">Edit Menu (ID: {id})</h2>

                    {/* Customer Details Accordion */}
                    <div className="mb-6 border border-gray-200 rounded-lg overflow-hidden transition-all duration-300">
                        <div
                            className={`flex justify-between items-center p-4 cursor-pointer transition-colors ${
                                formExpanded ? 'bg-indigo-600 text-white' : 'bg-gray-100 hover:bg-gray-200 text-gray-800'
                            }`}
                            onClick={() => setFormExpanded((prev) => !prev)}
                        >
                            <h2 className="text-lg font-bold">Client Information</h2>
                            {/* Icon placeholder */}
                        </div>

                        {formExpanded && (
                            <div className="p-4 bg-white space-y-3">
                                {/* Input Fields (Pre-filled with formData state) */}
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">Event Date</label>
                                        <input
                                            type="date"
                                            name="date"
                                            value={formData.date}
                                            onChange={handleFormChange}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">Place</label>
                                        <input
                                            type="text"
                                            name="place"
                                            value={formData.place}
                                            onChange={handleFormChange}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">Customer Name</label>
                                        <input
                                            type="text"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleFormChange}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="block text-xs font-medium text-gray-600 mb-1">Contact</label>
                                        <input
                                            type="text"
                                            name="contact"
                                            value={formData.contact}
                                            onChange={handleFormChange}
                                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:ring-indigo-500 focus:border-indigo-500"
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    
                    <h3 className="text-xl font-semibold mt-8 mb-4 text-gray-800">Event Menus</h3>

                    {/* Menu Contexts List */}
                    {menuContexts.map((context, index) => {
                        const isOpen = expandedIndex === index;
                        return (
                            <div key={context.id} className="border border-gray-200 rounded-lg shadow-sm overflow-hidden transition-all duration-300 mb-4">
                                <div
                                    className={`flex justify-between items-center p-3 cursor-pointer transition-colors ${
                                      isOpen ? 'bg-indigo-50 border-b-2 border-indigo-400' : 'bg-white hover:bg-gray-50'
                                    }`}
                                    onClick={() => toggleAccordion(index)}
                                >
                                    <div className="flex items-center space-x-2">
                                        <span className={`text-sm font-semibold w-6 h-6 flex items-center justify-center rounded-full ${isOpen ? 'bg-indigo-600 text-white' : 'bg-gray-200 text-gray-600'}`}>{index + 1}</span>
                                        <div className={`font-semibold ${isOpen ? 'text-indigo-700' : 'text-gray-800'}`}>
                                            {context.date || 'Select Date'} - {context.meal || 'Meal'}
                                        </div>
                                    </div>
                                    {/* Icon placeholder */}
                                </div>
                                {isOpen && (
                                    <div className="p-4 border-t">
                                        <MenuSelector context={context} onChange={(field, value) => updateContext(index, field, value)} />
                                        {/* NOTE: MenuItems will need an onChange handler to update context.items if items are editable here */}
                                        <MenuItems selectedItems={context.items} />
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* RIGHT PANEL: Invoice Preview */}
                <div className="flex-1 bg-white rounded-2xl shadow-xl p-6 border border-gray-100 overflow-y-auto max-h-[calc(100vh-2rem)]">
                    <div className="flex justify-between items-center">
                        <h2 className="text-2xl font-bold text-gray-900">Invoice Preview & Totals</h2>
                        <button
                            onClick={handleUpdateAndPrint}
                            disabled={isUpdating}
                            className={`px-6 py-3 text-white rounded-lg font-semibold shadow-md transition duration-150 ${
                                isUpdating ? 'bg-gray-400 cursor-not-allowed' : 'bg-green-600 hover:bg-green-700'
                            }`}
                        >
                            {isUpdating ? 'Saving...' : '🔄 Update & Print Invoice'}
                        </button>
                    </div>

                    <div className="mt-6">
                        <Preview
                            ref={componentRef}
                            menuContexts={menuContexts}
                            initialInvoiceData={invoiceData} 
                            formData={formData}
                            onInvoiceDataChange={setInvoiceData} // This updates the invoiceData state locally
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default InvoiceEditor;




























// import React, { useState, useEffect, useCallback, useMemo } from 'react';

// // Load Tailwind CSS for modern styling
// const TailwindScript = () => (
//     <script src="https://cdn.tailwindcss.com"></script>
// );

// // --- MOCK API DATA ---
// const mockPricingMap = {
//     BREAKFAST: 250,
//     LUNCH: 400,
//     EVENING_SNACKS: 150,
//     DINNER: 500,
//     TIFFIN: 300,
// };

// const mockMenuData = [
//     {
//         id: 101,
//         customer_name: "Tech Corp Annual Dinner",
//         contact: "9876543210",
//         date: "2025-02-14",
//         place: "Grand Ballroom, City Tower",
//         // Initial financial data loaded from "database"
//         initial_gst: 15000,
//         initial_advance: 50000,
//         initial_lead_counters: 2500,
//         initial_water_bottles: 1000,
//         initial_cooking_charges: 5000,
//         initial_labour_charges: 8000,
//         initial_transport_charges: 3000,
//         menu_details: [
//             { date: '2025-02-14', meal: 'DINNER', members: 150, buffet: 'PREMIUM BUFFET', price: mockPricingMap.DINNER,
//                 items: { STARTERS: ['Paneer Tikka', 'Aloo Chat'], MAIN_COURSE: ['Butter Naan', 'Dal Makhani', 'Veg Biryani'], DESSERT: ['Gulab Jamun'] }
//             },
//             { date: '2025-02-14', meal: 'LUNCH', members: 80, buffet: 'STANDARD', price: mockPricingMap.LUNCH,
//                 items: { RICE: ['Lemon Rice'], CURRIES: ['Sambar', 'Rasam'] }
//             },
//         ],
//     },
//     {
//         id: 102,
//         customer_name: "Wedding Reception - Sharma",
//         contact: "9900112233",
//         date: "2025-03-01",
//         place: "The Palm Gardens",
//         initial_gst: 12000,
//         initial_advance: 40000,
//         initial_lead_counters: 3000,
//         initial_water_bottles: 1500,
//         initial_cooking_charges: 6000,
//         initial_labour_charges: 10000,
//         initial_transport_charges: 4000,
//         menu_details: [
//             { date: '2025-03-01', meal: 'LUNCH', members: 200, buffet: 'GRAND BUFFET', price: mockPricingMap.LUNCH,
//                 items: { RICE: ['Pulao', 'White Rice'], CURRIES: ['Kadhi Pakoda', 'Aloo Gobi'], SWEETS: ['Rasmalai', 'Jalebi'] }
//             },
//         ],
//     },
// ];

// // --- UTILITY FUNCTIONS ---

// // Format date
// const formatDate = (dateStr) => {
//     if (!dateStr) return "";
//     const date = new Date(dateStr);
//     if (isNaN(date)) return dateStr;
//     const day = String(date.getDate()).padStart(2, "0");
//     const month = date.toLocaleString("en-US", { month: "short" }).toUpperCase();
//     const year = date.getFullYear();
//     return `${day}-${month}-${year}`;
// };

// // Format number (Indian style without decimals)
// const formatNumber = (num) => {
//     if (!num || isNaN(num)) return 0;
//     // Note: We use Intl.NumberFormat for clean, localized formatting
//     return new Intl.NumberFormat("en-IN", {
//         minimumFractionDigits: 0,
//         maximumFractionDigits: 0,
//     }).format(Math.round(Number(num)));
// };

// // Mock API call function
// const mockFetchMenuData = (id) => {
//     return new Promise((resolve) => {
//         setTimeout(() => {
//             if (id) {
//                 const data = mockMenuData.find(m => m.id === id);
//                 if (data) {
//                     resolve({ status: 200, data });
//                 } else {
//                     resolve({ status: 404, data: null });
//                 }
//             } else {
//                 // Return list of all menus (for list view)
//                 const listData = mockMenuData.map(client => ({
//                     id: client.id,
//                     name: client.customer_name,
//                     phone: client.contact,
//                     EventDate: formatDate(client.date),
//                     place: client.place,
//                 }));
//                 resolve({ status: 200, data: listData });
//             }
//         }, 500); // Simulate network latency
//     });
// };

// // --- CONFIRMATION MODAL COMPONENT ---

// const ConfirmationModal = ({ isOpen, title, message, onConfirm, onCancel }) => {
//     if (!isOpen) return null;

//     return (
//         <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-75 p-4 print:hidden backdrop-blur-sm">
//             <div className="bg-white rounded-xl shadow-2xl w-full max-w-md overflow-hidden transform transition-all">
//                 <div className="p-6">
//                     <h3 className="text-2xl font-bold text-red-600 mb-3 border-b pb-2">{title || "Confirm Action"}</h3>
//                     <p className="text-gray-700 mb-6">{message}</p>
//                     <div className="flex justify-end gap-3">
//                         <button
//                             onClick={onCancel}
//                             className="px-6 py-2 bg-gray-200 text-gray-800 rounded-xl font-semibold hover:bg-gray-300 transition-colors shadow-md"
//                         >
//                             Cancel
//                         </button>
//                         <button
//                             onClick={onConfirm}
//                             className="px-6 py-2 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700 transition-colors shadow-lg"
//                         >
//                             Confirm Delete
//                         </button>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };


// // --- EDIT INVOICE PAGE COMPONENT ---

// const EditInvoicePage = ({ menuId, onBackToListView }) => {

//     const [loading, setLoading] = useState(true);
//     const [error, setError] = useState(null);

//     // Initial State based on API structure
//     const [formData, setFormData] = useState({});
//     const [menuContexts, setMenuContexts] = useState([]);
    
//     // Financial State (Calculations)
//     const [gst, setGst] = useState(0);
//     const [advance, setAdvance] = useState(0);
//     const [leadCounters, setLeadCounters] = useState(0);
//     const [waterBottles, setWaterBottles] = useState(0);
//     const [cookingCharges, setCookingCharges] = useState(0);
//     const [labourCharges, setLabourCharges] = useState(0);
//     const [transportCharges, setTransportCharges] = useState(0);

//     // Invoice Rows State (Derived from menuContexts but allows editing)
//     const [invoiceRows, setInvoiceRows] = useState([]);

//     // --- MODAL STATE ---
//     const [isModalOpen, setIsModalOpen] = useState(false);
//     const [modalAction, setModalAction] = useState(null);
//     const [modalMessage, setModalMessage] = useState("");
//     const [modalTitle, setModalTitle] = useState("");


//     // --- DATA FETCHING EFFECT ---
//     useEffect(() => {
//         const fetchData = async () => {
//             setLoading(true);
//             setError(null);
//             const result = await mockFetchMenuData(menuId);
            
//             if (result.status === 200 && result.data) {
//                 const data = result.data;
                
//                 // Set customer info
//                 setFormData({
//                     id: data.id,
//                     name: data.customer_name,
//                     contact: data.contact,
//                     date: data.date,
//                     place: data.place,
//                 });

//                 // Set menu contexts
//                 setMenuContexts(data.menu_details);
                
//                 // Set initial financial charges
//                 setGst(data.initial_gst || 0);
//                 setAdvance(data.initial_advance || 0);
//                 setLeadCounters(data.initial_lead_counters || 0);
//                 setWaterBottles(data.initial_water_bottles || 0);
//                 setCookingCharges(data.initial_cooking_charges || 0);
//                 setLabourCharges(data.initial_labour_charges || 0);
//                 setTransportCharges(data.initial_transport_charges || 0);

//                 // Initialize invoice rows
//                 const initialRows = data.menu_details.map((ctx, i) => ({
//                     sno: i + 1,
//                     event: `${formatDate(ctx.date)} ${ctx.meal}`,
//                     members: parseInt(ctx.members) || 0,
//                     price: parseFloat(ctx.price) || 0,
//                     total: (parseInt(ctx.members) || 0) * (parseFloat(ctx.price) || 0),
//                     // Keep track of the original menu context index for removal linkage
//                     contextIndex: i, 
//                 }));
//                 setInvoiceRows(initialRows);

//             } else {
//                 setError(`Could not find menu with ID: ${menuId}`);
//             }
//             setLoading(false);
//         };

//         fetchData();
//     }, [menuId]); // Re-fetch if menuId changes

//     // --- CALCULATIONS MEMOIZED ---

//     // Total for all event rows
//     const rowsTotal = useMemo(() => 
//         invoiceRows.reduce((sum, row) => sum + (row.total || 0), 0),
//         [invoiceRows]
//     );

//     // Calculate Subtotal (Rows Total + Extra Charges)
//     const subtotal = useMemo(() => (
//         rowsTotal +
//         (leadCounters) +
//         (waterBottles) +
//         (cookingCharges) +
//         (labourCharges) +
//         (transportCharges)
//     ), [rowsTotal, leadCounters, waterBottles, cookingCharges, labourCharges, transportCharges]);

//     // Calculate Grand Total (Subtotal + GST)
//     const totalAmount = useMemo(() => subtotal + gst, [subtotal, gst]);
    
//     // Calculate Balance Due (Grand Total - Advance)
//     const balance = useMemo(() => totalAmount - advance, [totalAmount, advance]);

//     // --- HANDLERS ---

//     const handlePriceChange = useCallback((i, e) => {
//         const newPrice = parseFloat(e.target.value) || 0;
//         setInvoiceRows(prevRows => {
//             const rows = [...prevRows];
//             rows[i].price = newPrice;
//             rows[i].total = rows[i].members * newPrice;
//             return rows;
//         });
//     }, []);

//     const handleTotalChange = useCallback((i, e) => {
//         const newTotal = parseFloat(e.target.value) || 0;
//         setInvoiceRows(prevRows => {
//             const rows = [...prevRows];
//             rows[i].total = newTotal;
//             rows[i].price = rows[i].members > 0 ? newTotal / rows[i].members : 0;
//             return rows;
//         });
//     }, []);

//     const handleRemoveItem = useCallback((contextIndex, category, itemToRemove) => {
//         setMenuContexts(prevContexts => {
//             const newContexts = [...prevContexts];
//             if (newContexts[contextIndex] && newContexts[contextIndex].items[category]) {
//                 const items = newContexts[contextIndex].items[category];
//                 newContexts[contextIndex].items[category] = items.filter(item => item !== itemToRemove);
                
//                 // Clean up empty categories
//                 if (newContexts[contextIndex].items[category].length === 0) {
//                     delete newContexts[contextIndex].items[category];
//                 }
//             }
//             return newContexts;
//         });
//     }, []);

//     const handleRemoveContext = (indexToRemove) => {
//         // Sets up the confirmation modal for removing a whole menu context
//         setModalTitle("Confirm Menu Context Deletion");
//         setModalMessage(`You are about to delete the event: ${menuContexts[indexToRemove].meal} on ${formatDate(menuContexts[indexToRemove].date)}. This cannot be undone.`);
//         setModalAction(() => () => {
//             // The actual action to execute on confirmation
//             setMenuContexts(prevContexts => prevContexts.filter((_, i) => i !== indexToRemove));
//             // Also need to update invoice rows to reflect this
//             setInvoiceRows(prevRows => prevRows.filter(row => row.contextIndex !== indexToRemove));
//             setIsModalOpen(false);
//         });
//         setIsModalOpen(true);
//     };

//     const executeModalAction = () => {
//         if (typeof modalAction === 'function') {
//             modalAction();
//         }
//     };
    
//     if (loading) {
//         return (
//             <div className="flex justify-center items-center h-screen bg-gray-100">
//                 <div className="text-xl font-bold text-gray-700 p-8 bg-white rounded-xl shadow-lg animate-pulse">
//                     Loading Menu ID: {menuId} ...
//                 </div>
//             </div>
//         );
//     }

//     if (error || !formData.id) {
//         return (
//             <div className="flex justify-center items-center h-screen bg-red-50">
//                 <div className="p-8 bg-white rounded-xl shadow-xl border border-red-300">
//                     <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Invoice</h2>
//                     <p className="text-gray-700 mb-6">{error || "No data available for this ID."}</p>
//                     <button
//                         onClick={onBackToListView}
//                         className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition"
//                     >
//                         &larr; Back to Invoices List
//                     </button>
//                 </div>
//             </div>
//         );
//     }

//     return (
//         <div className="min-h-screen bg-gray-100 p-4 sm:p-8 font-inter">
//             {/* Custom Confirmation Modal */}
//             <ConfirmationModal
//                 isOpen={isModalOpen}
//                 title={modalTitle}
//                 message={modalMessage}
//                 onConfirm={executeModalAction}
//                 onCancel={() => setIsModalOpen(false)}
//             />

//             <div className="print:hidden mb-6 flex justify-between items-center max-w-4xl mx-auto">
//                 <button
//                     onClick={onBackToListView}
//                     className="bg-gray-700 text-white px-4 py-2 rounded-xl font-bold text-sm shadow-md hover:bg-gray-800 transition"
//                 >
//                     &larr; Back to Invoices List
//                 </button>
//                 <h1 className="text-2xl font-bold text-gray-800">Editing Invoice #{formData.id}</h1>
//                 <button
//                     onClick={() => window.print()}
//                     className="bg-[#00B254] text-white px-6 py-3 rounded-xl font-bold text-lg shadow-lg hover:bg-green-700 transition transform hover:scale-105"
//                 >
//                     Print / Save PDF
//                 </button>
//             </div>

//             {/* Invoice Preview Content (the main logic component) */}
//             <div
//                 className="max-w-4xl mx-auto bg-white p-6 text-black font-serif border border-black print:border-none rounded-lg shadow-2xl"
//                 style={{ minHeight: '100vh', margin: '20px auto' }}
//             >
//                 {/* ---------------- HEADER ---------------- */}
//                 <div className="header section mb-8 border-b-2 border-gray-400 pb-4">
//                     <h2 className="Mainheading text-center text-3xl font-extrabold uppercase mb-1 text-[#FFC100] tracking-wider">
//                         SHAMMUKHA CATERERS PVT. LTD
//                     </h2>
//                     <h4 className="text-center text-sm text-gray-700 mb-1 break-words">
//                         <span className="block sm:inline text-[#00B254] font-bold">
//                             An ISO 22000:2018 CERTIFIED COMPANY, Visit :
//                         </span>{" "}
//                         <a
//                             href="https://www.shanmukhacaterers.co.in/"
//                             target="_blank"
//                             rel="noreferrer"
//                             className="text-blue-600 hover:text-blue-800 transition block sm:inline underline-offset-2"
//                         >
//                             www.shammukhacaterers.co.in
//                         </a>
//                     </h4>
//                     <h4 className="text-center text-sm text-gray-700 mb-4 font-medium">
//                         VIDYA NAGAR, HYDERABAD - 500 044 | CUSTOMER CARE: 1800 890 3081.
//                     </h4>
//                     <h3 className="subheading text-center font-black uppercase text-lg text-[#00B254] border-t border-b border-[#00B254] py-1 mx-16">
//                         WE CATER TO YOUR HEALTH
//                     </h3>
//                 </div>

//                 {/* ---------------- CUSTOMER INFO ---------------- */}
//                 <div className="mb-6 text-base font-medium text-black flex flex-wrap justify-between gap-y-2 uppercase p-2 border border-gray-300 rounded-md bg-gray-50">
//                     <div className="w-full sm:w-[48%]">
//                         <span className="font-extrabold text-lg text-gray-800">
//                             Name:
//                         </span>{" "}
//                         {formData.name}
//                     </div>
//                     <div className="w-full sm:w-[48%] text-right sm:text-left">
//                         <span className="font-extrabold text-lg text-gray-800">
//                             Date:
//                         </span>{" "}
//                         {formatDate(formData.date)}
//                     </div>
//                     <div className="w-full sm:w-[48%]">
//                         <span className="font-extrabold text-lg text-gray-800">
//                             Contact:
//                         </span>{" "}
//                         +91 {formData.contact}
//                     </div>
//                     <div className="w-full sm:w-[48%] text-right sm:text-left">
//                         <span className="font-extrabold text-lg text-gray-800">
//                             Place:
//                         </span>{" "}
//                         {formData.place}
//                     </div>
//                 </div>

//                 {/* ---------------- MENU CONTEXT LIST ---------------- */}
//                 <h3 className="text-xl font-extrabold uppercase mb-4 text-center text-gray-800">Menu Breakdown</h3>
//                 {menuContexts.length === 0 ? (
//                     <p className="text-center text-gray-500 italic mb-8">No menu contexts found for this invoice.</p>
//                 ) : (
//                     menuContexts.map((ctx, index) => (
//                         <div
//                             key={index}
//                             className="mb-8 relative border border-gray-400 rounded-lg p-4 bg-white shadow-md hover:shadow-lg transition-shadow"
//                         >
//                             {/* Remove Context Button */}
//                             <button
//                                 onClick={() => handleRemoveContext(index)}
//                                 className="absolute top-2 right-2 text-red-600 text-sm border border-red-300 rounded-full w-8 h-8 flex items-center justify-center bg-red-50 hover:bg-red-100 transition print:hidden shadow-sm"
//                                 title="Remove entire menu context"
//                             >
//                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
//                                     <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 7a1 1 0 011 1v7a1 1 0 11-2 0V8a1 1 0 011-1zm6 0a1 1 0 00-1 1v7a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
//                                 </svg>
//                             </button>

//                             <h4
//                                 className="font-extrabold text-xl uppercase text-gray-900 mb-4 border-b pb-2 border-gray-300 pr-10"
//                             >
//                                 {formatDate(ctx.date)} {ctx.meal} FOR {ctx.members} MEMBERS{" "}
//                                 <span className="text-red-600">
//                                     {ctx.buffet?.toUpperCase()}
//                                 </span>
//                             </h4>

//                             {/* Category Table */}
//                             <table className="w-full text-base border-collapse border border-gray-400">
//                                 <tbody>
//                                     {Object.entries(ctx.items).map(([cat, items]) => (
//                                         <tr
//                                             key={cat}
//                                             className="border-b border-gray-300 align-top"
//                                         >
//                                             <td className="menuheaing p-3 font-bold text-gray-900 w-1/4 uppercase border-r border-gray-300 bg-gray-50">
//                                                 {cat}
//                                             </td>
//                                             <td className="p-2 font-medium text-gray-800 w-3/4 uppercase">
//                                                 <div className="flex flex-wrap gap-x-6 gap-y-2">
//                                                     {items.map((item, i) => (
//                                                         <span
//                                                             key={i}
//                                                             className="inline-flex items-center gap-1 bg-green-50 rounded-full px-3 py-1 border border-green-200"
//                                                         >
//                                                             <span className="font-semibold">{item}</span>
//                                                             <button
//                                                                 onClick={() => handleRemoveItem(index, cat, item)}
//                                                                 className="text-red-500 text-xs hover:text-red-700 transition print:hidden ml-1"
//                                                                 title="Remove item"
//                                                             >
//                                                                 <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
//                                                                     <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
//                                                                 </svg>
//                                                             </button>
//                                                         </span>
//                                                     ))}
//                                                 </div>
//                                             </td>
//                                         </tr>
//                                     ))}
//                                 </tbody>
//                             </table>
//                         </div>
//                     ))
//                 )}

//                 {/* ---------------- INVOICE SECTION ---------------- */}
//                 <div className="invoice-section-container pt-8 border-t-4 border-[#00B254]">
//                     <h3 className="text-xl font-extrabold uppercase mb-6 text-center text-gray-800">Final Billing Summary</h3>

//                     {/* ---------------- Invoice Table ---------------- */}
//                     <table className="w-full text-base border-collapse border border-black mt-4">
//                         <thead>
//                             <tr className="bg-[#FFC100] text-gray-900 font-extrabold text-center uppercase">
//                                 <th className="border border-black p-3">SNO</th>
//                                 <th className="border border-black p-3">EVENT</th>
//                                 <th className="border border-black p-3">MEMBERS</th>
//                                 <th className="border border-black p-3">PRICE (per member)</th>
//                                 <th className="border border-black p-3">TOTAL (&#8377;)</th>
//                             </tr>
//                         </thead>

//                         <tbody className="bg-white text-gray-900 font-semibold">
//                             {invoiceRows.map((row, i) => (
//                                 <tr key={i} className="text-center">
//                                     <td className="border border-black p-2">{row.sno}</td>
//                                     <td className="border border-black p-2 text-left">{row.event}</td>
//                                     <td className="border border-black p-2">{row.members}</td>
//                                     <td className="border border-black p-2 print:p-3">
//                                         <input
//                                             type="number"
//                                             value={row.price}
//                                             onChange={(e) => handlePriceChange(i, e)}
//                                             className="w-full text-center bg-transparent border-none focus:ring-1 focus:ring-blue-500 rounded-sm print:border-none print:focus:ring-0 print:p-0"
//                                             min="0"
//                                         />
//                                     </td>
//                                     <td className="border border-black p-2 print:p-3">
//                                         <input
//                                             type="number"
//                                             value={row.total}
//                                             onChange={(e) => handleTotalChange(i, e)}
//                                             className="w-full text-center bg-transparent border-none focus:ring-1 focus:ring-blue-500 rounded-sm font-bold text-red-600 print:border-none print:focus:ring-0 print:p-0"
//                                             min="0"
//                                         />
//                                     </td>
//                                 </tr>
//                             ))}

//                             {/* Extra Charges */}
//                             {[
//                                 { label: "LED Counters", value: leadCounters, setter: setLeadCounters },
//                                 { label: "Water Bottles", value: waterBottles, setter: setWaterBottles },
//                                 { label: "Cooking Charges", value: cookingCharges, setter: setCookingCharges },
//                                 { label: "Labour Charges", value: labourCharges, setter: setLabourCharges },
//                                 { label: "Transport Charges", value: transportCharges, setter: setTransportCharges },
//                             ].map((charge, index) => (
//                                 <tr key={index} className="text-center font-bold uppercase bg-gray-50">
//                                     <td colSpan="4" className="border border-black p-2 text-right">
//                                         {charge.label}
//                                     </td>
//                                     <td className="border border-black p-2 print:p-3">
//                                         <input
//                                             type="number"
//                                             value={charge.value}
//                                             onChange={(e) => charge.setter(parseFloat(e.target.value) || 0)}
//                                             className="w-full text-center bg-transparent border-none focus:ring-1 focus:ring-blue-500 rounded-sm print:border-none print:focus:ring-0 print:p-0"
//                                             min="0"
//                                         />
//                                     </td>
//                                 </tr>
//                             ))}

//                             {/* SUBTOTAL */}
//                             <tr className="font-extrabold text-lg text-red-700 bg-yellow-100">
//                                 <td colSpan="4" className="border border-black p-3 uppercase text-right">
//                                     SUBTOTAL
//                                 </td>
//                                 <td className="border border-black p-3 text-center">
//                                     &#8377; {formatNumber(subtotal)}
//                                 </td>
//                             </tr>

//                             {/* GST */}
//                             <tr className="font-bold bg-gray-100">
//                                 <td colSpan="4" className="border border-black p-3 uppercase text-right">
//                                     GST
//                                 </td>
//                                 <td className="border border-black p-2 print:p-3">
//                                     <input
//                                         type="number"
//                                         value={gst}
//                                         onChange={(e) => setGst(parseFloat(e.target.value) || 0)}
//                                         className="w-full text-center bg-transparent border-none focus:ring-1 focus:ring-blue-500 rounded-sm print:border-none print:focus:ring-0 print:p-0"
//                                         min="0"
//                                     />
//                                 </td>
//                             </tr>

//                             {/* GRAND TOTAL */}
//                             <tr className="font-extrabold text-xl text-red-700 bg-yellow-100">
//                                 <td colSpan="4" className="border border-black p-3 uppercase text-right">
//                                     GRAND TOTAL
//                                 </td>
//                                 <td className="border border-black p-3 text-center">
//                                     &#8377; {formatNumber(totalAmount)}
//                                 </td>
//                             </tr>

//                             {/* ADVANCE */}
//                             <tr className="font-bold bg-gray-100">
//                                 <td colSpan="4" className="border border-black p-3 uppercase text-right">
//                                     ADVANCE PAID
//                                 </td>
//                                 <td className="border border-black p-2 print:p-3">
//                                     <input
//                                         type="number"
//                                         value={advance}
//                                         onChange={(e) => setAdvance(parseFloat(e.target.value) || 0)}
//                                         className="w-full text-center bg-transparent border-none focus:ring-1 focus:ring-blue-500 rounded-sm print:border-none print:focus:ring-0 print:p-0"
//                                         min="0"
//                                     />
//                                 </td>
//                             </tr>

//                             {/* BALANCE */}
//                             <tr className="font-extrabold text-xl bg-red-100">
//                                 <td colSpan="4" className="border border-black p-3 uppercase text-right text-gray-900">
//                                     BALANCE AMOUNT DUE
//                                 </td>
//                                 <td className="border border-black p-3 text-center text-red-700">
//                                     &#8377; {formatNumber(balance)}
//                                 </td>
//                             </tr>
//                         </tbody>
//                     </table>

//                     {/* Last Section / Notes */}
//                     <div className="last-section mt-8 text-sm text-gray-800">
//                         <h4 className="text-center font-bold mb-3 p-2 bg-yellow-50 rounded-md border border-yellow-200">
//                             NOTE: ADDITIONAL WILL BE CHARGED FOR EXTRA PLATES
//                         </h4>
//                         <div className="text-center mt-6">
//                             <p className="font-bold text-base mb-1">
//                                 *** With best Wishes from Shanmukha Caterers Pvt.Ltd and Service....
//                             </p>
//                             <p className="font-bold text-base mt-4">
//                                 For Shanmukha Caterers Pvt.Ltd
//                             </p>
//                             <p className="font-extrabold text-lg mt-8 border-t border-gray-400 pt-1 inline-block">
//                                 Manager Signature
//                             </p>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };


// // --- LIST VIEW COMPONENT (Original EditMenu Logic) ---
// const MenuListPage = ({ onEdit }) => {
//     const [leads, setLeads] = useState([]);
//     const [loading, setLoading] = useState(true);

//     useEffect(() => {
//         const fetchClients = async () => {
//             setLoading(true);
//             const response = await mockFetchMenuData();
//             if (response.status === 200) {
//                 setLeads(response.data);
//             } else {
//                 console.error('Error fetching clients:', response);
//             }
//             setLoading(false);
//         };
//         fetchClients();
//     }, []);

//     return (
//         <div className="p-8 min-h-screen bg-gray-50 font-inter">
//             <h1 className="text-4xl font-extrabold text-gray-900 mb-8 border-b-4 border-[#00B254] pb-2 max-w-4xl mx-auto">
//                 Client Invoices List
//             </h1>

//             <div className="max-w-4xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden border border-gray-200">
//                 <div className="p-6">
//                     <h4 className="text-2xl font-semibold text-gray-800 mb-4">Invoices Overview</h4>
//                     <div className="overflow-x-auto">
//                         <table className="min-w-full divide-y divide-gray-200">
//                             <thead className="bg-[#FFC100] text-gray-900 uppercase text-sm">
//                                 <tr>
//                                     <th className="px-6 py-3 text-left font-extrabold tracking-wider rounded-tl-lg">SNo</th>
//                                     <th className="px-6 py-3 text-left font-extrabold tracking-wider">Name</th>
//                                     <th className="px-6 py-3 text-left font-extrabold tracking-wider">Phone</th>
//                                     <th className="px-6 py-3 text-left font-extrabold tracking-wider">Event Date</th>
//                                     <th className="px-6 py-3 text-center font-extrabold tracking-wider rounded-tr-lg">Actions</th>
//                                 </tr>
//                             </thead>
//                             <tbody className="bg-white divide-y divide-gray-200">
//                                 {loading ? (
//                                     <tr><td colSpan="5" className="px-6 py-4 text-center text-gray-500">Loading...</td></tr>
//                                 ) : leads.length === 0 ? (
//                                     <tr><td colSpan="5" className="px-6 py-4 text-center text-gray-500">No invoices available</td></tr>
//                                 ) : (
//                                     leads.map((lead, i) => (
//                                         <tr key={lead.id} className="hover:bg-gray-50 transition">
//                                             <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{i + 1}.</td>
//                                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 font-semibold">{lead.name}</td>
//                                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{lead.phone}</td>
//                                             <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{lead.EventDate}</td>
//                                             <td className="px-6 py-4 whitespace-nowrap text-center text-sm font-medium">
//                                                 <button 
//                                                     className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 transition"
//                                                     onClick={() => onEdit(lead.id)}
//                                                 >
//                                                     <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                                                       <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
//                                                     </svg>
//                                                     Edit
//                                                 </button>
//                                                 <button 
//                                                     className="inline-flex items-center ml-4 px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 transition"
//                                                     disabled
//                                                 >
//                                                     Share (Disabled)
//                                                 </button>
//                                             </td>
//                                         </tr>
//                                     ))
//                                 )}
//                             </tbody>
//                         </table>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };


// // --- MAIN APP COMPONENT (Handles view switching) ---
// const App = () => {
//     // viewMode: 'list' | 'edit'
//     const [viewMode, setViewMode] = useState('list');
//     const [selectedMenuId, setSelectedMenuId] = useState(null);

//     const handleEdit = (id) => {
//         setSelectedMenuId(id);
//         setViewMode('edit');
//     };

//     const handleBack = () => {
//         setSelectedMenuId(null);
//         setViewMode('list');
//     };

//     return (
//         <div className="font-inter">
//             <TailwindScript />
//             <style>{`
//                 /* Global Print Styles for Invoice Editor */
//                 @media print {
//                     body {
//                         background-color: #fff !important;
//                         margin: 0;
//                         padding: 0;
//                     }
//                     .print\\:border-none {
//                         border: none !important;
//                     }
//                     .print\\:hidden {
//                         display: none !important;
//                     }
//                     .max-w-4xl {
//                         max-width: none !important;
//                     }
//                     /* Remove blue focus ring from inputs in print mode */
//                     input[type="number"] {
//                         border: none !important;
//                         box-shadow: none !important;
//                         padding: 0 !important;
//                     }
//                 }
//                 /* Custom input styling for table edits */
//                 input[type="number"] {
//                     -moz-appearance: textfield;
//                     text-align: center;
//                 }
//                 input::-webkit-outer-spin-button,
//                 input::-webkit-inner-spin-button {
//                     -webkit-appearance: none;
//                     margin: 0;
//                 }
//             `}</style>
            
//             {viewMode === 'list' ? (
//                 <MenuListPage onEdit={handleEdit} />
//             ) : (
//                 <EditInvoicePage 
//                     menuId={selectedMenuId} 
//                     onBackToListView={handleBack}
//                 />
//             )}
//         </div>
//     );
// };

// export default App;