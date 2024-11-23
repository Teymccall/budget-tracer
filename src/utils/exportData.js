import jsPDF from 'jspdf';
import 'jspdf-autotable';
import { MONEY_RECEIVERS, MONEY_RECIPIENTS } from './constants';

export const exportToPDF = (transactions) => {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(20);
  doc.text('Transaction Report', 14, 22);
  doc.setFontSize(12);
  doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 32);

  // Separate transactions
  const receivedMoney = transactions.filter(t => t.type === 'income');
  const sentMoney = transactions.filter(t => t.type === 'expense');

  // Calculate totals
  const totalReceived = receivedMoney.reduce((sum, t) => sum + t.amount, 0);
  const totalSent = sentMoney.reduce((sum, t) => sum + t.amount, 0);

  // Summary section
  doc.setFontSize(14);
  doc.text('Summary', 14, 45);
  doc.setFontSize(12);
  doc.text(`Total Received: GHS ${totalReceived.toFixed(2)}`, 14, 55);
  doc.text(`Total Sent: GHS ${totalSent.toFixed(2)}`, 14, 62);
  doc.text(`Net Balance: GHS ${(totalReceived - totalSent).toFixed(2)}`, 14, 69);

  // Money Received Section
  doc.setFontSize(14);
  doc.text('Money Received', 14, 85);
  
  // Group received money by person
  const receivedByPerson = MONEY_RECEIVERS.reduce((acc, person) => {
    const transactions = receivedMoney.filter(t => t.person === person);
    if (transactions.length > 0) {
      acc[person] = {
        transactions,
        total: transactions.reduce((sum, t) => sum + t.amount, 0)
      };
    }
    return acc;
  }, {});

  let yPos = 95;
  Object.entries(receivedByPerson).forEach(([person, data]) => {
    doc.autoTable({
      startY: yPos,
      head: [[`Received from ${person} - Total: GHS ${data.total.toFixed(2)}`]],
      body: data.transactions.map(t => [
        `${new Date(t.date).toLocaleDateString()} | GHS ${t.amount.toFixed(2)} | ${t.category} | ${t.description}`
      ]),
      theme: 'grid',
      styles: { fontSize: 10 },
      margin: { left: 14 }
    });
    yPos = doc.lastAutoTable.finalY + 10;
  });

  // Add new page if needed
  if (yPos > 250) {
    doc.addPage();
    yPos = 20;
  }

  // Money Sent Section
  doc.setFontSize(14);
  doc.text('Money Sent', 14, yPos);
  yPos += 10;

  // Group sent money by person
  const sentByPerson = MONEY_RECIPIENTS.reduce((acc, person) => {
    const transactions = sentMoney.filter(t => t.person === person);
    if (transactions.length > 0) {
      acc[person] = {
        transactions,
        total: transactions.reduce((sum, t) => sum + t.amount, 0)
      };
    }
    return acc;
  }, {});

  Object.entries(sentByPerson).forEach(([person, data]) => {
    doc.autoTable({
      startY: yPos,
      head: [[`Sent to ${person} - Total: GHS ${data.total.toFixed(2)}`]],
      body: data.transactions.map(t => [
        `${new Date(t.date).toLocaleDateString()} | GHS ${t.amount.toFixed(2)} | ${t.category} | ${t.description}`
      ]),
      theme: 'grid',
      styles: { fontSize: 10 },
      margin: { left: 14 }
    });
    yPos = doc.lastAutoTable.finalY + 10;

    // Add new page if needed
    if (yPos > 250) {
      doc.addPage();
      yPos = 20;
    }
  });

  // Other Expenses Section
  const otherExpenses = sentMoney.filter(t => !MONEY_RECIPIENTS.includes(t.person));
  if (otherExpenses.length > 0) {
    doc.setFontSize(14);
    doc.text('Other Expenses', 14, yPos);
    yPos += 10;

    doc.autoTable({
      startY: yPos,
      head: [['Date', 'Amount', 'Category', 'Description']],
      body: otherExpenses.map(t => [
        new Date(t.date).toLocaleDateString(),
        `GHS ${t.amount.toFixed(2)}`,
        t.category,
        t.description
      ]),
      theme: 'grid',
      styles: { fontSize: 10 },
      margin: { left: 14 }
    });
  }

  // Food Items Section
  const foodItems = sentMoney.filter(t => t.category === 'FOOD STUFFS' && t.foodItems);
  if (foodItems.length > 0) {
    doc.setFontSize(14);
    doc.text('Food Items', 14, yPos);
    yPos += 10;

    foodItems.forEach(transaction => {
      if (transaction.foodItems) {
        doc.autoTable({
          startY: yPos,
          head: [['Item', 'Price', 'Quantity', 'Total']],
          body: transaction.foodItems.map(item => [
            item.name,
            `GHS ${parseFloat(item.price).toFixed(2)}`,
            item.quantity,
            `GHS ${(parseFloat(item.price) * parseInt(item.quantity)).toFixed(2)}`
          ]),
          foot: [[
            'Total',
            '',
            '',
            `GHS ${transaction.amount.toFixed(2)}`
          ]],
          theme: 'grid',
          styles: { fontSize: 8 },
          margin: { left: 14 }
        });
        yPos = doc.lastAutoTable.finalY + 10;
      }
    });
  }

  // Save the PDF
  doc.save(`hanamels_budget_${new Date().toLocaleDateString()}.pdf`);
}; 