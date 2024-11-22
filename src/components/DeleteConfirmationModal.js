import { motion, AnimatePresence } from 'framer-motion';
import { FaTrash, FaTimes } from 'react-icons/fa';

function DeleteConfirmationModal({ isOpen, onClose, onConfirm, transaction }) {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div 
        className="modal-overlay"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={(e) => {
          if (e.target.className === 'modal-overlay') {
            onClose();
          }
        }}
      >
        <motion.div 
          className="delete-modal glass"
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          transition={{ type: "spring", damping: 20 }}
        >
          <div className="delete-modal-header">
            <FaTrash className="delete-icon" />
            <h2>Confirm Delete</h2>
            <motion.button
              className="close-btn"
              onClick={onClose}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <FaTimes />
            </motion.button>
          </div>

          <div className="delete-modal-content">
            <p>Are you sure you want to delete this transaction?</p>
            <div className="transaction-preview">
              <div className="preview-row">
                <span className="label">Type:</span>
                <span className={`value ${transaction.type}`}>
                  {transaction.type === 'income' ? 'Money Received' : 'Money Sent'}
                </span>
              </div>
              <div className="preview-row">
                <span className="label">Amount:</span>
                <span className={`value amount ${transaction.type}`}>
                  ₵{transaction.amount.toFixed(2)}
                </span>
              </div>
              <div className="preview-row">
                <span className="label">From/To:</span>
                <span className="value">{transaction.person}</span>
              </div>
              <div className="preview-row">
                <span className="label">Category:</span>
                <span className="value">{transaction.category}</span>
              </div>
            </div>
          </div>

          <div className="delete-modal-actions">
            <motion.button
              className="cancel-btn"
              onClick={onClose}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Cancel
            </motion.button>
            <motion.button
              className="delete-btn"
              onClick={onConfirm}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Delete
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}

export default DeleteConfirmationModal; 