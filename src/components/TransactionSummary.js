import { useBudget } from '../contexts/BudgetContext';
import { motion, AnimatePresence } from 'framer-motion';
import { FaArrowUp, FaArrowDown, FaCalendar, FaTag, FaMoneyBill, FaClock } from 'react-icons/fa';

function TransactionSummary() {
  const { state } = useBudget();
  const { transactions } = state;

  const TransactionCard = ({ transaction }) => (
    <motion.div
      className="transaction-item glass"
      whileHover={{ scale: 1.02, y: -5 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
    >
      <div className="transaction-info">
        <div className="transaction-header">
          <h4>{transaction.type === 'income' ? 'From: ' : 'To: '}{transaction.person}</h4>
          <div className="transaction-time">
            <FaClock className="icon" />
            {new Date(transaction.date).toLocaleTimeString([], { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
          </div>
        </div>
        <p className="transaction-purpose">{transaction.description}</p>
        <div className="transaction-meta">
          <span className="category">
            <FaTag className="icon" />
            {transaction.category}
          </span>
          <span className="date">
            <FaCalendar className="icon" />
            {new Date(transaction.date).toLocaleDateString()}
          </span>
          <span className="payment-method">
            <FaMoneyBill className="icon" />
            {transaction.paymentMethod}
          </span>
        </div>
      </div>
      <div className={`transaction-amount ${transaction.type}`}>
        {transaction.type === 'income' ? '+' : '-'}₵{transaction.amount.toFixed(2)}
      </div>
    </motion.div>
  );

  const SectionHeader = ({ title, icon: Icon, type, total }) => (
    <motion.div 
      className="section-header glass"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <div className="header-title">
        <Icon className={`section-icon ${type}`} />
        <h2>{title}</h2>
      </div>
      <div className={`section-total ${type}`}>
        Total: ₵{total.toFixed(2)}
      </div>
    </motion.div>
  );

  // Calculate totals
  const totalReceived = transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalSent = transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0);

  return (
    <div className="transaction-summary">
      <motion.div 
        className="money-received"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <SectionHeader 
          title="Money Received" 
          icon={FaArrowDown} 
          type="income"
          total={totalReceived}
        />
        <AnimatePresence>
          {transactions
            .filter(t => t.type === 'income')
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map(transaction => (
              <TransactionCard 
                key={transaction.id} 
                transaction={transaction}
              />
            ))}
        </AnimatePresence>
      </motion.div>

      <motion.div 
        className="money-sent"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <SectionHeader 
          title="Money Sent" 
          icon={FaArrowUp} 
          type="expense"
          total={totalSent}
        />
        <AnimatePresence>
          {transactions
            .filter(t => t.type === 'expense')
            .sort((a, b) => new Date(b.date) - new Date(a.date))
            .map(transaction => (
              <TransactionCard 
                key={transaction.id} 
                transaction={transaction}
              />
            ))}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}

export default TransactionSummary; 