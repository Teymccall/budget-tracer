import { useBudget } from '../contexts/BudgetContext';
import { motion } from 'framer-motion';

function PersonalTransactions() {
  const { state } = useBudget();

  // Group transactions by person
  const personTransactions = state.transactions.reduce((acc, transaction) => {
    const person = transaction.person;
    if (!acc[person]) {
      acc[person] = {
        sent: 0,
        received: 0,
        transactions: []
      };
    }
    
    if (transaction.type === 'expense') {
      acc[person].sent += transaction.amount;
    } else {
      acc[person].received += transaction.amount;
    }
    
    acc[person].transactions.push(transaction);
    return acc;
  }, {});

  return (
    <div className="personal-transactions">
      <h2>Transactions by Person</h2>
      <div className="person-list">
        {Object.entries(personTransactions).map(([person, data]) => (
          <motion.div 
            key={person}
            className="person-card glass"
            whileHover={{ scale: 1.02 }}
          >
            <h3>{person}</h3>
            <div className="person-summary">
              <div className="sent">
                <label>Sent</label>
                <p className="amount expense">${data.sent.toFixed(2)}</p>
              </div>
              <div className="received">
                <label>Received</label>
                <p className="amount income">${data.received.toFixed(2)}</p>
              </div>
              <div className="balance">
                <label>Balance</label>
                <p className={`amount ${data.received - data.sent > 0 ? 'income' : 'expense'}`}>
                  ${Math.abs(data.received - data.sent).toFixed(2)}
                  {data.received - data.sent > 0 ? ' (They owe you)' : ' (You owe them)'}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

export default PersonalTransactions; 