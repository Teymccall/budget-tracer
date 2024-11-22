import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useBudget } from '../contexts/BudgetContext';
import TransactionForm from '../components/TransactionForm';
import TransactionItem from '../components/TransactionItem';
import FloatingActionButton from '../components/FloatingActionButton';
import ExportButtons from '../components/ExportButtons';

function Transactions() {
  const { state, dispatch } = useBudget();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [editingTransaction, setEditingTransaction] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleEdit = (transaction) => {
    setEditingTransaction(transaction);
    setShowForm(true);
  };

  const handleDelete = (id) => {
    dispatch({ type: 'DELETE_TRANSACTION', payload: id });
  };

  const filteredTransactions = state.transactions
    .filter(transaction => {
      const matchesSearch = 
        transaction.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.category?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        transaction.person?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesFilter = filterType === 'all' || transaction.type === filterType;
      return matchesSearch && matchesFilter;
    })
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  return (
    <motion.div 
      className="container transactions"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="page-header">
        <div className="header-title">
          <h1>Transactions</h1>
        </div>
        <div className="header-actions">
          <ExportButtons />
        </div>
      </div>
      
      <motion.div 
        className="filters glass"
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
      >
        <input
          type="text"
          placeholder="Search transactions..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="search-input"
        />
        
        <select
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
          className="filter-select"
        >
          <option value="all">All Transactions</option>
          <option value="income">Money Received</option>
          <option value="expense">Money Sent/Spent</option>
        </select>
      </motion.div>

      {showForm && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
        >
          <TransactionForm 
            editingTransaction={editingTransaction}
            setEditingTransaction={setEditingTransaction}
            onClose={() => {
              setShowForm(false);
              setEditingTransaction(null);
            }}
          />
        </motion.div>
      )}

      <AnimatePresence>
        <motion.div 
          className="transactions-list"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {filteredTransactions.length === 0 ? (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="no-transactions"
            >
              No transactions found
            </motion.p>
          ) : (
            filteredTransactions.map((transaction) => (
              <TransactionItem
                key={transaction.id}
                transaction={transaction}
                onEdit={handleEdit}
                onDelete={handleDelete}
              />
            ))
          )}
        </motion.div>
      </AnimatePresence>

      <FloatingActionButton 
        onClick={() => {
          setEditingTransaction(null);
          setShowForm(true);
        }}
      />
    </motion.div>
  );
}

export default Transactions; 