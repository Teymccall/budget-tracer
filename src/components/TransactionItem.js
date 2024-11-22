import { useState } from 'react';
import { motion } from 'framer-motion';
import { FaTrash, FaEdit } from 'react-icons/fa';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { useBudget } from '../contexts/BudgetContext';

function TransactionItem({ transaction, onEdit }) {
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const { dispatch } = useBudget();

  const handleDelete = (id) => {
    dispatch({ type: 'DELETE_TRANSACTION', payload: id });
    setShowDeleteModal(false);
  };

  return (
    <>
      <motion.div
        className="transaction-item"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        whileHover={{ scale: 1.02 }}
        layout
      >
        <div className="transaction-info">
          <div className="transaction-header">
            <h4>{transaction.type === 'expense' ? 'Sent to' : 'Received from'}: {transaction.person}</h4>
            <div className="action-buttons">
              <motion.button
                className="action-btn edit"
                onClick={() => onEdit(transaction)}
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(59, 130, 246, 0.2)' }}
                whileTap={{ scale: 0.95 }}
              >
                <FaEdit />
              </motion.button>
              <motion.button
                className="action-btn delete"
                onClick={() => setShowDeleteModal(true)}
                whileHover={{ scale: 1.1, backgroundColor: 'rgba(239, 68, 68, 0.2)' }}
                whileTap={{ scale: 0.95 }}
              >
                <FaTrash />
              </motion.button>
            </div>
          </div>
          <p className="transaction-purpose">{transaction.description}</p>
          <div className="transaction-meta">
            <motion.span 
              className="category"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              {transaction.category}
            </motion.span>
            <span className="date">
              {new Date(transaction.date).toLocaleDateString()}
            </span>
            <span className="payment-method">{transaction.paymentMethod}</span>
          </div>
        </div>
        <div className={`transaction-amount ${transaction.type}`}>
          {transaction.type === 'income' ? '+' : '-'}₵{transaction.amount.toFixed(2)}
        </div>
      </motion.div>

      <DeleteConfirmationModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => handleDelete(transaction.id)}
        transaction={transaction}
      />
    </>
  );
}

export default TransactionItem; 