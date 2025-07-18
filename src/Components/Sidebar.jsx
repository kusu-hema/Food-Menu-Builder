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
} from 'react-icons/fa';

const menuItems = [
  { label: 'Dashboard', icon: <FaTachometerAlt />, path: '/dashboard' },
  { label: 'Leads', icon: <FaUserFriends />, path: '/leads' },
  { label: 'Customers', icon: <FaUsers />, path: '/customers' },
  { label: 'Orders', icon: <FaShoppingCart />, path: '/orders' },
  { label: 'Categories', icon: <FaLayerGroup />, path: '/categories' },
  { label: 'Products', icon: <FaBoxOpen />, path: '/products' },
  { label: 'Invoice', icon: <FaFileInvoice />, path: '/invoice' },
  { label: 'Corporate Events', icon: <FaCalendarAlt />, path: '/events' },
  { label: 'Packages', icon: <FaList />, path: '/packages' },
  { label: 'Logout', icon: <FaSignOutAlt />, path: '/' },
];

const Sidebar = () => {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <>
      <style>{`
        .sidebar-wrapper {
          display: flex;
        }

        .sidebar-toggle {
          position: fixed;
          top: 1rem;
          left: 1rem;
          z-index: 1001;
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
          transition: transform 0.3s ease-in-out;
        }

        .sidebar.closed {
          transform: translateX(-100%);
          position: fixed;
        }

        .sidebar-title {
          font-size: 1.75rem;
          font-weight: 700;
          color: #5b28f0;
          margin-bottom: 2.5rem;
          text-align: center;
        }

        .sidebar-menu {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .sidebar-item {
          display: flex;
          align-items: center;
          gap: 0.75rem;
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
          transform: translateX(2px);
        }

        .sidebar-item.active {
          background: linear-gradient(90deg, #5b28f0 0%, #6a4ff4 100%);
          color: white;
        }

        .sidebar-icon {
          font-size: 1.2rem;
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
          margin-bottom: 0.25rem;
        }

        .avatar-role {
          font-size: 0.75rem;
          color: #6b7280;
        }
      `}</style>

      <button className="sidebar-toggle" onClick={toggleSidebar}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      <div className="sidebar-wrapper">
        <div className={`sidebar ${isOpen ? '' : 'closed'}`}>
          <div>
            <h1 className="sidebar-title">Shanmukha</h1>
            <ul className="sidebar-menu">
              {menuItems.map((item, index) => (
                <li
                  key={index}
                  className={`sidebar-item ${location.pathname === item.path ? 'active' : ''}`}
                >
                  <Link
                    to={item.path}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.75rem',
                      color: 'inherit',
                      textDecoration: 'none',
                      width: '100%'
                    }}
                  >
                    <span className="sidebar-icon">{item.icon}</span>
                    {item.label}
                  </Link>
                </li>
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
      </div>
    </>
  );
};

export default Sidebar;
