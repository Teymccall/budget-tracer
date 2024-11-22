import { motion } from 'framer-motion';
import { FaPlus } from 'react-icons/fa';

function FloatingActionButton({ onClick }) {
  return (
    <motion.button
      className="add-transaction-btn glass"
      onClick={onClick}
      whileHover={{ 
        scale: 1.05,
        boxShadow: "0px 8px 15px rgba(0, 0, 0, 0.2)",
      }}
      whileTap={{ scale: 0.95 }}
      initial={{ scale: 0, opacity: 0 }}
      animate={{ 
        scale: 1, 
        opacity: 1,
        transition: {
          type: "spring",
          stiffness: 260,
          damping: 20
        }
      }}
    >
      <FaPlus className="add-icon" />
      <span>Add Transaction</span>
    </motion.button>
  );
}

export default FloatingActionButton; 