import { motion } from 'framer-motion';
import { FaFilePdf } from 'react-icons/fa';
import { useBudget } from '../contexts/BudgetContext';
import jsPDF from 'jspdf';
import 'jspdf-autotable';

function SpecializedExportButton() {
  const { state } = useBudget();
  const SPECIAL_PEOPLE = ['MR ACHUMBORO', 'NITA', 'MRS ACHUMBORO', 'GERTRUDE', 'GEORGINA'];

  const exportFoodReport = () => {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(20);
    doc.text('Food Stuffs Report', 14, 22);
    doc.setFontSize(12);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 32);

    let yPos = 45;

    // Filter transactions for food stuffs from special people
    const foodTransactions = state.transactions.filter(t => 
      t.category === 'FOOD STUFFS' && 
      SPECIAL_PEOPLE.includes(t.person) &&
      t.type === 'income'
    );

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

    // Add each person's food transactions
    Object.entries(groupedByPerson).forEach(([person, data]) => {
      if (yPos > 250) {
        doc.addPage();
        yPos = 20;
      }

      doc.setFontSize(14);
      doc.text(`Food Money from ${person}`, 14, yPos);
      yPos += 10;

      data.transactions.forEach(transaction => {
        doc.autoTable({
          startY: yPos,
          head: [[`Date: ${new Date(transaction.date).toLocaleDateString()} - Amount: ₵${transaction.amount.toFixed(2)}`]],
          body: [
            [`Purpose: ${transaction.description}`]
          ],
          theme: 'grid',
          styles: { fontSize: 10 },
          margin: { left: 14 }
        });
        yPos = doc.lastAutoTable.finalY + 5;

        // Add itemized food list if available
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

      // Add total for this person
      doc.setFontSize(12);
      doc.text(`Total from ${person}: ₵${data.total.toFixed(2)}`, 14, yPos);
      yPos += 15;
    });

    // Add grand total
    const totalFoodMoney = Object.values(groupedByPerson)
      .reduce((sum, { total }) => sum + total, 0);
    
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(14);
    doc.text('Summary', 14, yPos);
    yPos += 10;
    doc.setFontSize(12);
    doc.text(`Total Food Money Received: ₵${totalFoodMoney.toFixed(2)}`, 14, yPos);

    // Save the PDF
    doc.save(`food_report_${new Date().toLocaleDateString()}.pdf`);
  };

  return (
    <motion.button
      className="export-btn specialized"
      onClick={exportFoodReport}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      <FaFilePdf />
      <span>Export Food Report</span>
    </motion.button>
  );
}

export default SpecializedExportButton; 