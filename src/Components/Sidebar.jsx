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
import Shanmukhalogo from '../assets/shanmukhalogo.png';

const menuItems = [
  { label: 'Dashboard', icon: <FaTachometerAlt />, path: '/dashboard' },
  { label: 'Leads', icon: <FaUserFriends />, path: '/leads' },
  {
    label: 'Customers',
    icon: <FaUsers />,
    children: [
      { label: 'Create Customer', path: '/customers/create' },
      { label: 'Total Customers', path: '/customers/total' },
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
      { label: 'Add Category', path: '/categories/add' },
      { label: 'All Categories', path: '/categories/all' },
    ],
  },
  {
    label: 'Products',
    icon: <FaBoxOpen />,
    children: [
      { label: 'Add Product', path: '/products/add' },
      { label: 'All Products', path: '/products/all' },
    ],
  },
  {
    label: 'Invoice',
    icon: <FaFileInvoice />,
    children: [
      { label: 'Create Invoice', path: '/invoice/create' },
      { label: 'All Invoices', path: '/invoice/all' },
    ],
  },
  {
    label: 'Corporate Events',
    icon: <FaCalendarAlt />,
    children: [
      { label: 'Add Event', path: '/events/add' },
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
  { label: 'Logout', icon: <FaSignOutAlt />, path: '/logout' },
];

const Sidebar = ({ isOpen, toggleSidebar }) => {
  const location = useLocation();
  const [openDropdown, setOpenDropdown] = useState(null);

  return (
    <>
      <style>{`
        .sidebar-toggle {
          position: fixed;
          top: 1rem;
          left: 1rem;
          z-index: 1200;
          background: #5b28f0;
          border: none;
          color: white;
          padding: 0.5rem 0.75rem;
          font-size: 1.25rem;
          border-radius: 0.375rem;
          cursor: pointer;
        }
        .sidebar {
          height: 100vh;
          width: 16rem;
          background: linear-gradient(180deg, #ffffff 0%, #f9fafb 100%);
          border-right: 1px solid #e5e7eb;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding: 1.5rem 1rem;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.04);
          overflow-y: auto;
          transition: all 0.3s ease-in-out;
        }
        .sidebar.fixed {
          position: fixed;
          left: 0;
          top: 0;
          z-index: 1100;
        }
        .sidebar.closed {
          display: none;
        }
        .sidebar-title {
          font-size: 1.5rem;
          font-weight: 700;
          color: #5b28f0;
          margin: 0;
        }
        .sidebar-menu {
          list-style: none;
          padding: 0;
          margin-top: 1.5rem;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .sidebar-item {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0.65rem 1rem;
          font-size: 0.95rem;
          font-weight: 500;
          color: #374151;
          border-radius: 0.625rem;
          cursor: pointer;
          transition: all 0.25s ease-in-out;
        }
        .sidebar-item:hover {
          background: #f0f4ff;
          color: #5b28f0;
        }
        .sidebar-item.active {
          background: linear-gradient(90deg, #5b28f0 0%, #6a4ff4 100%);
          color: white;
        }
        .sidebar-icon {
          margin-right: 0.75rem;
        }
        .dropdown-child {
          list-style: none;
          padding-left: 1.5rem;
          margin-top: 0.25rem;
          margin-bottom: 0.5rem;
        }
        .dropdown-child li {
          padding: 0.45rem 0.5rem;
          font-size: 0.88rem;
          color: #374151;
          border-radius: 0.5rem;
        }
        .dropdown-child li:hover {
          background: #f0f4ff;
          color: #5b28f0;
        }
        .sidebar-avatar {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: #eef2ff;
          padding: 0.75rem;
          border-radius: 0.75rem;
          margin-top: 2rem;
        }
        .avatar-img {
          height: 2.5rem;
          width: 2.5rem;
          border-radius: 50%;
          object-fit: cover;
          border: 2px solid #5b28f0;
        }
        .avatar-name {
          font-size: 0.875rem;
          font-weight: 600;
          color: #1f2937;
        }
        .avatar-role {
          font-size: 0.75rem;
          color: #6b7280;
        }
      `}</style>

      <button className="sidebar-toggle" onClick={toggleSidebar}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      <div className={`sidebar ${isOpen ? 'fixed' : 'closed'}`}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2rem' }}>
            <img
              src={Shanmukhalogo}
              alt="Shanmukha Logo"
              style={{ height: '40px', width: '40px', marginRight: '10px' }}
            />
            <h1 className="sidebar-title">Shanmukha</h1>
          </div>

          <ul className="sidebar-menu">
            {menuItems.map((item, index) => (
              <React.Fragment key={index}>
                <li
                  className={`sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
                  onClick={() =>
                    item.children
                      ? setOpenDropdown(openDropdown === index ? null : index)
                      : null
                  }
                >
                  <Link
                    to={item.path || '#'}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      color: 'inherit',
                      textDecoration: 'none',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center' }}>
                      <span className="sidebar-icon">{item.icon}</span>
                      {item.label}
                    </div>

                    {item.children && (
                      <span>
                        {openDropdown === index ? <FaChevronDown /> : <FaChevronRight />}
                      </span>
                    )}
                  </Link>
                </li>

                {item.children && openDropdown === index && (
                  <ul className="dropdown-child">
                    {item.children.map((child, childIdx) => (
                      <li key={childIdx}>
                        <Link to={child.path}>{child.label}</Link>
                      </li>
                    ))}
                  </ul>
                )}
              </React.Fragment>
            ))}
          </ul>
        </div>

        <div className="sidebar-avatar">
          <img
            src="https://via.placeholder.com/40"
            alt="user"
            className="avatar-img"
          />
          <div>
            <p className="avatar-name">Shanmukha</p>
            <p className="avatar-role">Owner</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default Sidebar;
