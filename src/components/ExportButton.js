import { motion } from 'framer-motion';
import { FaFilePdf } from 'react-icons/fa';
import { exportToPDF } from '../utils/exportData';
import { useBudget } from '../contexts/BudgetContext';

function ExportButton() {
  const { state } = useBudget();

  return (
    <motion.button
      className="export-btn glass"
      onClick={() => exportToPDF(state.transactions)}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <FaFilePdf />
      <span>Export to PDF</span>
    </motion.button>
  );
}

export default ExportButton; 