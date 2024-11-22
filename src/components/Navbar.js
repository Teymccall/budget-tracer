import { Link, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import { FaMoon, FaSun, FaHome, FaExchangeAlt, FaPlus, FaSignOutAlt, FaUsers } from 'react-icons/fa';
import { motion } from 'framer-motion';
import { useState } from 'react';
import AdminUserManager from './AdminUserManager';

function Navbar({ onAddTransaction, onLogout, username }) {
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const [showUserManager, setShowUserManager] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  return (
    <>
      <div className="app-header">
        <div className="header-buttons">
          {currentUser?.isAdmin && (
            <motion.button
              className="header-btn users-btn"
              onClick={() => setShowUserManager(true)}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaUsers className="btn-icon" />
              <span>Users</span>
            </motion.button>
          )}
          <motion.button
            className="header-btn logout-btn"
            onClick={onLogout}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaSignOutAlt className="btn-icon" />
            <span>{username}</span>
          </motion.button>
        </div>
        <h1 className="app-title">
          <span className="title-main">Hanamel's</span>
          <span className="title-sub">Expenses Tracker</span>
        </h1>
      </div>

      {/* User Management Modal */}
      {showUserManager && (
        <div className="modal-overlay" onClick={(e) => {
          if (e.target.className === 'modal-overlay') {
            setShowUserManager(false);
          }
        }}>
          <div className="modal-content user-manager-modal">
            <div className="modal-header">
              <h2>User Management</h2>
              <motion.button
                className="close-modal-btn"
                onClick={() => setShowUserManager(false)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                ×
              </motion.button>
            </div>
            <AdminUserManager onClose={() => setShowUserManager(false)} />
          </div>
        </div>
      )}

      {/* Bottom Navigation */}
      <nav className={`bottom-nav ${theme}`}>
        <Link to="/" className={`nav-item ${location.pathname === '/' ? 'active' : ''}`}>
          <FaHome className="nav-icon" />
          <span className="nav-text">Home</span>
        </Link>
        
        <button 
          onClick={onAddTransaction} 
          className="nav-item add-transaction"
        >
          <FaPlus className="nav-icon" />
          <span className="nav-text">Add</span>
        </button>
        
        <Link 
          to="/transactions" 
          className={`nav-item ${location.pathname === '/transactions' ? 'active' : ''}`}
        >
          <FaExchangeAlt className="nav-icon" />
          <span className="nav-text">Trans</span>
        </Link>
        
        <motion.button 
          onClick={toggleTheme} 
          className="nav-item theme-toggle"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
        >
          {theme === 'dark' ? <FaSun className="nav-icon" /> : <FaMoon className="nav-icon" />}
          <span className="nav-text">{theme === 'dark' ? 'Light' : 'Dark'}</span>
        </motion.button>
      </nav>
    </>
  );
}

export default Navbar; 