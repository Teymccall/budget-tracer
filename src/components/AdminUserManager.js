import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEdit, FaTrash, FaBan, FaUnlock, FaFileDownload, FaUserShield, FaUserPlus, FaUser, FaTimes, FaLock } from 'react-icons/fa';
import { exportToPDF } from '../utils/exportData';

function AdminUserManager({ onClose }) {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newUser, setNewUser] = useState({
    username: '',
    password: ''
  });

  useEffect(() => {
    const savedUsers = JSON.parse(localStorage.getItem('users') || '[]');
    setUsers(savedUsers);
  }, []);

  const handleEditUser = (user) => {
    setEditingUser({
      ...user,
      newPassword: ''
    });
    setShowEditModal(true);
  };

  const handleDeleteUser = (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      const updatedUsers = users.filter(user => user.id !== userId);
      localStorage.setItem('users', JSON.stringify(updatedUsers));
      setUsers(updatedUsers);
    }
  };

  const handleToggleBlock = (userId) => {
    const updatedUsers = users.map(user => {
      if (user.id === userId) {
        return { ...user, isBlocked: !user.isBlocked };
      }
      return user;
    });
    
    // Update users in localStorage
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setUsers(updatedUsers);

    // Check if the blocked user is currently logged in
    const currentUser = JSON.parse(localStorage.getItem('currentUser'));
    if (currentUser && currentUser.id === userId) {
      // Force logout if the user is currently logged in
      localStorage.removeItem('currentUser');
      window.location.reload(); // Refresh the page to trigger logout
    }
  };

  const handleExportUserTransactions = (userId) => {
    const userTransactions = JSON.parse(localStorage.getItem(`budgetState_${userId}`))?.transactions || [];
    exportToPDF(userTransactions);
  };

  const saveUserChanges = (e) => {
    e.preventDefault();
    const updatedUsers = users.map(user => {
      if (user.id === editingUser.id) {
        return {
          ...editingUser,
          password: editingUser.newPassword ? editingUser.newPassword : editingUser.password
        };
      }
      return user;
    });

    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
    setShowEditModal(false);
    setEditingUser(null);
  };

  const handleAddUser = (e) => {
    e.preventDefault();
    const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
    
    if (existingUsers.some(user => user.username === newUser.username)) {
      alert('Username already exists');
      return;
    }

    const userToAdd = {
      id: Date.now().toString(),
      username: newUser.username,
      password: newUser.password,
      isAdmin: false,
      isBlocked: false
    };

    const updatedUsers = [...existingUsers, userToAdd];
    localStorage.setItem('users', JSON.stringify(updatedUsers));
    setUsers(updatedUsers);
    setNewUser({ username: '', password: '' });
    setShowAddModal(false);
  };

  return (
    <motion.div 
      className="admin-panel glass"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="admin-header">
        <div className="admin-title">
          <FaUserShield className="admin-icon" />
          <h2>User Management</h2>
        </div>
        <div className="admin-actions">
          <motion.button
            className="add-user-btn"
            onClick={() => setShowAddModal(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaUserPlus className="btn-icon" />
            <span>Add User</span>
          </motion.button>
          <div className="user-count">Total Users: {users.length}</div>
        </div>
      </div>

      <div className="users-grid">
        {users.map(user => (
          <motion.div 
            key={user.id}
            className={`user-card glass ${user.isBlocked ? 'blocked' : ''}`}
            whileHover={{ scale: 1.02, y: -5 }}
          >
            <div className="user-header">
              <div className="user-info">
                <FaUser className="user-avatar" />
                <div className="user-details">
                  <h3>{user.username}</h3>
                  <span className={`user-status ${user.isBlocked ? 'blocked' : 'active'}`}>
                    {user.isBlocked ? 'Blocked' : 'Active'}
                  </span>
                </div>
              </div>
              <div className="user-meta">
                <p>ID: {user.id}</p>
                <p>Type: {user.isAdmin ? 'Admin' : 'Regular User'}</p>
                <p>Created: {new Date(parseInt(user.id)).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="user-actions">
              <motion.button
                className="action-btn edit"
                onClick={() => handleEditUser(user)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                title="Edit User"
              >
                <FaEdit />
              </motion.button>

              <motion.button
                className="action-btn delete"
                onClick={() => handleDeleteUser(user.id)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                title="Delete User"
              >
                <FaTrash />
              </motion.button>

              <motion.button
                className={`action-btn ${user.isBlocked ? 'unblock' : 'block'}`}
                onClick={() => handleToggleBlock(user.id)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                title={user.isBlocked ? 'Unblock User' : 'Block User'}
              >
                {user.isBlocked ? <FaUnlock /> : <FaBan />}
              </motion.button>

              <motion.button
                className="action-btn export"
                onClick={() => handleExportUserTransactions(user.id)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                title="Export Transactions"
              >
                <FaFileDownload />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {showEditModal && (
        <motion.div 
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="edit-user-modal glass"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
          >
            <div className="modal-header">
              <div className="modal-title">
                <h3>Edit User</h3>
              </div>
              <motion.button
                className="modal-close-btn"
                onClick={() => setShowEditModal(false)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                ×
              </motion.button>
            </div>

            <form onSubmit={saveUserChanges} className="edit-user-form">
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  value={editingUser.username}
                  onChange={(e) => setEditingUser({
                    ...editingUser,
                    username: e.target.value
                  })}
                  placeholder="Enter username"
                  required
                />
              </div>

              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  value={editingUser.newPassword}
                  onChange={(e) => setEditingUser({
                    ...editingUser,
                    newPassword: e.target.value
                  })}
                  placeholder="Leave blank to keep current password"
                />
              </div>

              <div className="form-group checkbox-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={editingUser.isBlocked}
                    onChange={(e) => setEditingUser({
                      ...editingUser,
                      isBlocked: e.target.checked
                    })}
                  />
                  <span>Block User</span>
                </label>
              </div>

              <div className="modal-actions">
                <motion.button 
                  type="submit" 
                  className="save-btn"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Save Changes
                </motion.button>
                <motion.button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setShowEditModal(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {showAddModal && (
        <motion.div 
          className="modal-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div 
            className="add-user-modal glass"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", damping: 20 }}
          >
            <div className="modal-header">
              <div className="modal-title">
                <h3>Add New User</h3>
              </div>
              <motion.button
                className="modal-close-btn"
                onClick={() => setShowAddModal(false)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                ×
              </motion.button>
            </div>

            <form onSubmit={handleAddUser} className="add-user-form">
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  value={newUser.username}
                  onChange={(e) => setNewUser({
                    ...newUser,
                    username: e.target.value
                  })}
                  placeholder="Enter username"
                  required
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <input
                  type="password"
                  value={newUser.password}
                  onChange={(e) => setNewUser({
                    ...newUser,
                    password: e.target.value
                  })}
                  placeholder="Enter password"
                  required
                />
              </div>

              <div className="modal-actions">
                <motion.button 
                  type="submit" 
                  className="save-btn"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Add User
                </motion.button>
                <motion.button 
                  type="button" 
                  className="cancel-btn"
                  onClick={() => setShowAddModal(false)}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  );
}

export default AdminUserManager; 