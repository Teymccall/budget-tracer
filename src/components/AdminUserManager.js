import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaUserShield, FaUserPlus, FaUser, FaEdit, FaTrash, FaUnlock, FaBan } from 'react-icons/fa';
import { 
  collection, 
  doc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  where,
  onSnapshot 
} from 'firebase/firestore';
import { db } from '../firebase';

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
    // Real-time users listener
    const unsubscribe = onSnapshot(collection(db, 'users'), (snapshot) => {
      const usersData = snapshot.docs.map(doc => ({
        ...doc.data(),
        id: doc.id
      }));
      setUsers(usersData);
    });

    return () => unsubscribe();
  }, []);

  const handleEditUser = (user) => {
    setEditingUser({
      ...user,
      newPassword: ''
    });
    setShowEditModal(true);
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        // Delete user document from Firestore
        await deleteDoc(doc(db, 'users', userId));
        
        // Delete user's transactions
        const q = query(collection(db, 'transactions'), where('userId', '==', userId));
        const querySnapshot = await getDocs(q);
        const deletePromises = querySnapshot.docs.map(doc => deleteDoc(doc.ref));
        await Promise.all(deletePromises);

        alert('User deleted successfully');
      } catch (error) {
        console.error('Error deleting user:', error);
        alert('Error deleting user. Please try again.');
      }
    }
  };

  const handleToggleBlock = async (userId, isBlocked) => {
    try {
      await updateDoc(doc(db, 'users', userId), {
        isBlocked: isBlocked
      });
      alert(`User ${isBlocked ? 'blocked' : 'unblocked'} successfully`);
    } catch (error) {
      console.error('Error updating user:', error);
      alert(`Error ${isBlocked ? 'blocking' : 'unblocking'} user. Please try again.`);
    }
  };

  const saveUserChanges = async (e) => {
    e.preventDefault();
    try {
      const userRef = doc(db, 'users', editingUser.id);
      const updateData = {
        username: editingUser.username,
        isBlocked: editingUser.isBlocked
      };

      // If there's a new password, update it
      if (editingUser.newPassword) {
        updateData.password = editingUser.newPassword;
      }

      await updateDoc(userRef, updateData);
      setShowEditModal(false);
      setEditingUser(null);
      alert('User updated successfully');
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Error updating user. Please try again.');
    }
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
                <p>Created: {new Date(user.createdAt).toLocaleDateString()}</p>
              </div>
            </div>

            <div className="user-actions">
              <motion.button
                className="action-btn edit"
                onClick={() => handleEditUser(user)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaEdit />
              </motion.button>

              <motion.button
                className="action-btn delete"
                onClick={() => handleDeleteUser(user.id)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                <FaTrash />
              </motion.button>

              <motion.button
                className={`action-btn ${user.isBlocked ? 'unblock' : 'block'}`}
                onClick={() => handleToggleBlock(user.id, !user.isBlocked)}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
              >
                {user.isBlocked ? <FaUnlock /> : <FaBan />}
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {showEditModal && (
        <div className="modal-overlay">
          <motion.div 
            className="edit-user-modal glass"
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
          >
            <div className="modal-header">
              <h3>Edit User</h3>
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
                  value={editingUser?.username || ''}
                  onChange={(e) => setEditingUser({
                    ...editingUser,
                    username: e.target.value
                  })}
                  required
                />
              </div>

              <div className="form-group">
                <label>New Password</label>
                <input
                  type="password"
                  value={editingUser?.newPassword || ''}
                  onChange={(e) => setEditingUser({
                    ...editingUser,
                    newPassword: e.target.value
                  })}
                  placeholder="Leave blank to keep current password"
                />
              </div>

              <div className="form-group">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    checked={editingUser?.isBlocked || false}
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
        </div>
      )}
    </motion.div>
  );
}

export default AdminUserManager; 