import { useBudget } from '../contexts/BudgetContext';
import { useTheme } from '../contexts/ThemeContext';
import { motion } from 'framer-motion';
import { 
  Chart as ChartJS, 
  ArcElement, 
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend 
} from 'chart.js';
import { Pie, Bar } from 'react-chartjs-2';
import TransactionSummary from '../components/TransactionSummary';
import ExportButtons from '../components/ExportButtons';
import { FaWallet, FaArrowDown, FaArrowUp } from 'react-icons/fa';

// Register ChartJS components
ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

function Dashboard() {
  const { state } = useBudget();
  const { isDarkMode } = useTheme();
  const { balance, totalIncome, totalExpenses, transactions } = state;

  // Calculate category totals
  const categoryTotals = transactions.reduce((acc, transaction) => {
    if (transaction.type === 'expense') {
      acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
    }
    return acc;
  }, {});

  // Prepare data for pie chart
  const pieChartData = {
    labels: Object.keys(categoryTotals),
    datasets: [{
      data: Object.values(categoryTotals),
      backgroundColor: [
        '#FF6384',
        '#36A2EB',
        '#FFCE56',
        '#4BC0C0',
        '#9966FF'
      ],
    }]
  };

  // Get monthly totals for bar chart
  const getMonthlyData = () => {
    const monthlyData = {};
    transactions.forEach(transaction => {
      const date = new Date(transaction.date);
      const monthYear = `${date.getMonth() + 1}/${date.getFullYear()}`;
      if (transaction.type === 'expense') {
        monthlyData[monthYear] = (monthlyData[monthYear] || 0) + transaction.amount;
      }
    });
    return monthlyData;
  };

  const monthlyData = getMonthlyData();

  // Prepare data for bar chart
  const barChartData = {
    labels: Object.keys(monthlyData),
    datasets: [{
      label: 'Monthly Expenses',
      data: Object.values(monthlyData),
      backgroundColor: '#36A2EB',
    }]
  };

  // Update the recent transactions formatting
  const recentTransactions = transactions
    .slice(0, 5)
    .map(transaction => ({
      ...transaction,
      formattedDate: new Date(transaction.date).toLocaleDateString(),
      formattedTime: new Date(transaction.date).toLocaleTimeString([], { 
        hour: '2-digit', 
        minute: '2-digit' 
      })
    }));

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 260,
        damping: 20
      }
    }
  };

  return (
    <motion.div 
      className="container dashboard"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="dashboard-header">
        <motion.h1
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          Dashboard
        </motion.h1>
        <div className="dashboard-actions">
          <ExportButtons />
        </div>
      </div>

      <motion.div className="summary-cards" variants={containerVariants}>
        <motion.div className="card balance glass" variants={itemVariants}>
          <div className="card-header">
            <h3>Current Balance</h3>
            <div className="card-icon">
              <FaWallet />
            </div>
          </div>
          <motion.p className="amount">
            GH₵{balance.toFixed(2)}
          </motion.p>
        </motion.div>

        <motion.div className="card income glass" variants={itemVariants}>
          <div className="card-header">
            <h3>Money Received</h3>
            <div className="card-icon">
              <FaArrowDown />
            </div>
          </div>
          <motion.p className="amount income">
            +GH₵{totalIncome.toFixed(2)}
          </motion.p>
        </motion.div>

        <motion.div className="card expenses glass" variants={itemVariants}>
          <div className="card-header">
            <h3>Money Sent</h3>
            <div className="card-icon">
              <FaArrowUp />
            </div>
          </div>
          <motion.p className="amount expense">
            -GH₵{totalExpenses.toFixed(2)}
          </motion.p>
        </motion.div>
      </motion.div>

      <TransactionSummary />

      <motion.div 
        className="dashboard-charts"
        variants={containerVariants}
      >
        <motion.div 
          className="chart-container glass"
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <h3>Expenses by Category</h3>
          <div className="pie-chart">
            {Object.keys(categoryTotals).length > 0 ? (
              <Pie data={pieChartData} options={{ 
                plugins: { 
                  legend: { 
                    position: 'bottom',
                    labels: { color: isDarkMode ? '#f3f4f6' : '#1f2937' }
                  } 
                },
                animation: {
                  animateScale: true,
                  animateRotate: true
                }
              }} />
            ) : (
              <p>No expense data available</p>
            )}
          </div>
        </motion.div>

        <motion.div 
          className="chart-container glass"
          variants={itemVariants}
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <h3>Monthly Expenses</h3>
          <div className="bar-chart">
            {Object.keys(monthlyData).length > 0 ? (
              <Bar 
                data={barChartData} 
                options={{
                  responsive: true,
                  scales: {
                    y: {
                      beginAtZero: true,
                      ticks: { color: isDarkMode ? '#f3f4f6' : '#1f2937' }
                    },
                    x: {
                      ticks: { color: isDarkMode ? '#f3f4f6' : '#1f2937' }
                    }
                  },
                  plugins: {
                    legend: {
                      labels: { color: isDarkMode ? '#f3f4f6' : '#1f2937' }
                    }
                  },
                  animation: {
                    duration: 2000,
                    easing: 'easeInOutQuart'
                  }
                }}
              />
            ) : (
              <p>No expense data available</p>
            )}
          </div>
        </motion.div>
      </motion.div>

      <motion.div 
        className="recent-transactions"
        variants={containerVariants}
      >
        <motion.h3 variants={itemVariants}>Recent Transactions</motion.h3>
        <motion.div className="transactions-list" variants={containerVariants}>
          {recentTransactions.map((transaction, index) => (
            <motion.div
              key={transaction.id}
              className="transaction-item glass"
              variants={itemVariants}
              whileHover={{ 
                scale: 1.02,
                boxShadow: "0px 5px 15px rgba(0,0,0,0.1)"
              }}
              transition={{ type: "spring", stiffness: 400, damping: 17 }}
            >
              <div className="transaction-info">
                <div className="transaction-header">
                  <h4>{transaction.type === 'income' ? 'From: ' : 'To: '}{transaction.person}</h4>
                  <span className="transaction-time">{transaction.formattedTime}</span>
                </div>
                <p className="transaction-purpose">{transaction.description}</p>
                <p className="transaction-details">
                  <motion.span 
                    className="category"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    {transaction.category}
                  </motion.span>
                  <span className="date">{transaction.formattedDate}</span>
                </p>
              </div>
              <motion.p 
                className={`amount ${transaction.type}`}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ delay: index * 0.1 }}
              >
                {transaction.type === 'income' ? '+' : '-'}GH₵{transaction.amount.toFixed(2)}
              </motion.p>
            </motion.div>
          ))}
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default Dashboard; 