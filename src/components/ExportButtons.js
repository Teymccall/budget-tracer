import { motion } from 'framer-motion';
import { FaFileDownload, FaUtensils, FaUsers, FaEllipsisV } from 'react-icons/fa';
import { useState } from 'react';
import { useBudget } from '../contexts/BudgetContext';
import { exportToPDF } from '../utils/exportData';
import { SPECIAL_PEOPLE } from '../utils/constants';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function ExportButtons() {
  const { state } = useBudget();
  const [showMenu, setShowMenu] = useState(false);
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));

  const exportFoodReport = () => {
    const doc = new jsPDF();
    
    // Filter only food stuff transactions from special people
    const foodTransactions = state.transactions.filter(t => 
      t.category === 'FOOD STUFFS' && 
      SPECIAL_PEOPLE.includes(t.person) &&
      t.type === 'income'
    );

    // Add title
    doc.setFontSize(20);
    doc.text('Food Stuffs Report', 14, 22);
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 32);

    let yPos = 45;

    // Group by person
    const groupedByPerson = SPECIAL_PEOPLE.reduce((acc, person) => {
      const transactions = foodTransactions.filter(t => t.person === person);
      if (transactions.length > 0) {
        acc[person] = {
          transactions,
          total: transactions.reduce((sum, t) => sum + t.amount, 0)
        };
      }
      return acc;
    }, {});

    Object.entries(groupedByPerson).forEach(([person, data]) => {
      doc.setFontSize(14);
      doc.text(`Food Money from ${person}`, 14, yPos);
      yPos += 10;

      data.transactions.forEach(transaction => {
        if (transaction.foodItems && transaction.foodItems.length > 0) {
          doc.autoTable({
            startY: yPos,
            head: [['Item', 'Price', 'Quantity', 'Total']],
            body: transaction.foodItems.map(item => [
              item.name,
              `₵${parseFloat(item.price).toFixed(2)}`,
              item.quantity,
              `₵${(parseFloat(item.price) * parseInt(item.quantity)).toFixed(2)}`
            ]),
            theme: 'grid',
            styles: { fontSize: 8 },
            margin: { left: 14 }
          });
          yPos = doc.lastAutoTable.finalY + 10;
        }
      });

      doc.setFontSize(12);
      doc.text(`Total from ${person}: ₵${data.total.toFixed(2)}`, 14, yPos);
      yPos += 15;

      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }
    });

    doc.save(`hanamels_budget_food_${new Date().toLocaleDateString()}.pdf`);
  };

  const exportSpecialReport = () => {
    const doc = new jsPDF();
    
    // Filter transactions from special people
    const specialTransactions = state.transactions.filter(t => 
      SPECIAL_PEOPLE.includes(t.person) && t.type === 'income'
    );

    // Add title
    doc.setFontSize(20);
    doc.text('Special People Report', 14, 22);
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 32);

    let yPos = 45;

    // Group by person
    const groupedByPerson = SPECIAL_PEOPLE.reduce((acc, person) => {
      const transactions = specialTransactions.filter(t => t.person === person);
      if (transactions.length > 0) {
        acc[person] = {
          transactions,
          total: transactions.reduce((sum, t) => sum + t.amount, 0)
        };
      }
      return acc;
    }, {});

    Object.entries(groupedByPerson).forEach(([person, data]) => {
      doc.setFontSize(14);
      doc.text(`Transactions from ${person}`, 14, yPos);
      yPos += 10;

      doc.autoTable({
        startY: yPos,
        head: [['Date', 'Category', 'Description', 'Amount']],
        body: data.transactions.map(t => [
          new Date(t.date).toLocaleDateString(),
          t.category,
          t.description,
          `₵${t.amount.toFixed(2)}`
        ]),
        theme: 'grid',
        styles: { fontSize: 10 },
        margin: { left: 14 }
      });

      yPos = doc.lastAutoTable.finalY + 10;
      doc.setFontSize(12);
      doc.text(`Total from ${person}: ₵${data.total.toFixed(2)}`, 14, yPos);
      yPos += 15;

      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }
    });

    doc.save(`hanamels_budget_special_${new Date().toLocaleDateString()}.pdf`);
  };

  return (
    <div className="export-buttons-wrapper">
      {currentUser?.isAdmin ? (
        // Admin view with all export options
        <>
          {/* Mobile Menu Button */}
          <motion.button
            className="mobile-menu-btn"
            onClick={() => setShowMenu(!showMenu)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <FaEllipsisV />
            <span className="menu-label">Export Options</span>
          </motion.button>

          {/* Export Buttons Container */}
          <motion.div 
            className={`export-buttons-container ${showMenu ? 'show' : ''}`}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <motion.button
              className="export-btn-icon all"
              onClick={() => exportToPDF(state.transactions)}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaFileDownload className="export-icon" />
              <span className="export-label">All</span>
            </motion.button>

            <motion.button
              className="export-btn-icon food"
              onClick={exportFoodReport}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaUtensils className="export-icon" />
              <span className="export-label">Food</span>
            </motion.button>

            <motion.button
              className="export-btn-icon special"
              onClick={exportSpecialReport}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <FaUsers className="export-icon" />
              <span className="export-label">Special</span>
            </motion.button>
          </motion.div>
        </>
      ) : (
        // Regular user view with single export button
        <motion.button
          className="export-btn-icon all"
          onClick={() => exportToPDF(state.transactions)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <FaFileDownload className="export-icon" />
          <span className="export-label">Export Transactions</span>
        </motion.button>
      )}
    </div>
  );
}

export default ExportButtons; 