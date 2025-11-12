import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  FaTachometerAlt,
  FaUserFriends,
  FaUsers,
  FaShoppingCart,
  FaLayerGroup,
  FaBoxOpen,
  FaFileInvoice,
  FaCalendarAlt,
  FaList,
  FaSignOutAlt,
  FaBars,
  FaTimes,
  FaChevronDown,
  FaChevronRight,
} from 'react-icons/fa';
// Image 
import Shanmukhalogo from '../assets/img/shanmukhalogo.png';


// Menu Items Paths 
const menuItems = [
  { label: 'Dashboard', icon: <FaTachometerAlt />, path: '/dashboard' },
  {
    label: 'Leads',
    icon: <FaUserFriends />,
    children: [
      { label: 'Total leads', path: '/leads' },
      { label: 'Create Customer', path: '/dashboard' },
    ],
  },
  {
    label: 'Customers',
    icon: <FaUsers />,
    children: [
      { label: 'Create Customer', path: '/dashboard' },
      { label: 'Customer Profile', path: '/customerprofile' },
      { label: 'Total Customers', path: '/customers/total' },
    ],
  },
  {
    label: 'Menu',
    icon: <FaUsers />,
    children: [
      { label: 'Create Menu', path: '/invoice' },
      { label: 'Total Menus', path: '/totalmenu' },
      { label: 'Save Menu', path: '/menu'},
      { label: 'Total Customers', path: '/editmenu' },
    ],
  },
  {
    label: 'Orders',
    icon: <FaShoppingCart />,
    children: [
      { label: 'Create Order', path: '/orders/create' },
      { label: 'Total Orders', path: '/orders/total' },
    ],
  },
  {
    label: 'Categories',
    icon: <FaLayerGroup />,
    children: [
      { label: 'Add Category', path: '/categories' },
      { label: 'All Categories', path: '/events' },
    ],
  },
  {
    label: 'Products',
    icon: <FaBoxOpen />,
    children: [
      { label: 'Add Product', path: '/products' },
      { label: 'All Products', path: '/products/all' },
    ],
  },
  {
    label: 'Invoice',
    icon: <FaFileInvoice />,
    children: [
      { label: 'Create Invoice', path: '/invoice' },
      { label: 'All Invoices', path: '/invoice/all' },
    ],
  },
  {
    label: 'Corporate Events',
    icon: <FaCalendarAlt />,
    children: [
      { label: 'Add Event', path: '/events' },
      { label: 'All Events', path: '/events/all' },
    ],
  },
  {
    label: 'Packages',
    icon: <FaList />,
    children: [
      { label: 'Create Package', path: '/packages/create' },
      { label: 'All Packages', path: '/packages/all' },
    ],
  },
  {
    label: 'HR',
    icon: <FaList />,
    children: [
      { label: 'Create Package', path: '/packages/create' },
      { label: 'All Packages', path: '/packages/all' },
    ],
  },
  { label: 'Logout', icon: <FaSignOutAlt />, path: '/logout' },
];

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = useState(null);

  return (
    <>
      <button
        className="fixed top-4 left-4 z-[1200] bg-[#5b28f0] text-white px-3 py-2 text-xl rounded-md cursor-pointer"
        onClick={toggleSidebar}
      >
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      <div
        className={`${
          isOpen ? 'fixed' : 'hidden'
        } h-screen w-64 bg-gradient-to-b from-white to-gray-50 border-r border-gray-200 flex flex-col justify-between px-4 py-6 shadow-md overflow-y-auto z-[1100]`}
      >
        <div>
          <div className="flex items-center mb-8 pt-8">
            <img
              src={Shanmukhalogo}
              alt="Shanmukha Logo"
              className="h-[70px] w-[70px] mr-3"
            />
            <h1 className="text-[#5b28f0] font-bold text-xl">Shanmukha</h1>
          </div>

          <ul className="space-y-2">
            {menuItems.map((item, index) => (
              <React.Fragment key={index}>
                <li
                  className={`flex items-center justify-between px-4 py-2.5 text-sm font-medium rounded-lg cursor-pointer transition duration-200 ${
                    location.pathname === item.path
                      ? 'bg-gradient-to-r from-[#5b28f0] to-[#6a4ff4] text-white'
                      : 'text-gray-700 hover:bg-[#f0f4ff] hover:text-[#5b28f0]'
                  }`}
                  onClick={() =>
                    item.children
                      ? setOpenDropdown(openDropdown === index ? null : index)
                      : null
                  }
                >
                  {/* Drop Down Menu  */}
                  <Link
                    to={item.path || '#'}
                    className="flex items-center justify-between w-full text-inherit no-underline"
                  >
                    <div className="flex items-center gap-3">
                      <span>{item.icon}</span>
                      {item.label}
                    </div>
                    {item.children && (
                      <span>
                        {openDropdown === index ? (
                          <FaChevronDown />
                        ) : (
                          <FaChevronRight />
                        )}
                      </span>
                    )}
                  </Link>
                </li>
                
                {/* Sub menu  */}
                
                {item.children && openDropdown === index && (
                  <ul className="pl-6 mt-1 mb-2 space-y-1">
                    {item.children.map((child, childIdx) => (
                      <li key={childIdx}>
                        <Link
                          to={child.path}
                          className={`block px-2 py-1.5 text-sm rounded transition duration-200 ${
                            location.pathname === child.path
                              ? 'bg-gradient-to-r from-[#5b28f0] to-[#6a4ff4] text-white'
                              : 'text-gray-700 hover:bg-[#f0f4ff] hover:text-[#5b28f0]'
                          }`}
                        >
                          {child.label}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}



              </React.Fragment>
            ))}
          </ul>
        </div>

        <div className="flex items-center gap-3 bg-[#eef2ff] p-3 rounded-xl mt-8">
          <img
            src={Shanmukhalogo}
            alt="Shanmukha Avatar"
            className="h-10 w-10 rounded-full object-cover border-2 border-[#5b28f0]"
          />
          <div>
            <p className="text-sm font-semibold text-gray-900">Shanmukha</p>
            <p className="text-xs text-gray-500">Owner</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;