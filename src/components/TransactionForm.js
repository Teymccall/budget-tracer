import { useState, useEffect } from 'react';
import { useBudget } from '../contexts/BudgetContext';
import { useTheme } from '../contexts/ThemeContext';
import { 
  MONEY_RECEIVERS, 
  MONEY_RECIPIENTS, 
  EXPENSE_CATEGORIES, 
  INCOME_CATEGORIES,
  PAYMENT_METHODS 
} from '../utils/constants';
import FoodItemsList from './FoodItemsList';

function TransactionForm({ editingTransaction, setEditingTransaction, onClose }) {
  const { dispatch } = useBudget();
  const { theme } = useTheme();
  const currentUser = JSON.parse(localStorage.getItem('currentUser'));
  
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'expense',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString('en-GB', {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit'
    }),
    category: '',
    person: '',
    paymentMethod: 'CASH',
  });
  const [foodItems, setFoodItems] = useState([]);

  useEffect(() => {
    if (editingTransaction) {
      setFormData({
        ...editingTransaction,
        date: new Date(editingTransaction.date).toISOString().split('T')[0],
        time: new Date(editingTransaction.date).toLocaleTimeString('en-GB', {
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit'
        }),
        amount: editingTransaction.amount.toString(),
      });
      setFoodItems(editingTransaction.foodItems || []);
    }
  }, [editingTransaction]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const now = new Date();
    const transactionDate = new Date(formData.date);
    
    // Set the time components from the current time
    transactionDate.setHours(now.getHours());
    transactionDate.setMinutes(now.getMinutes());
    transactionDate.setSeconds(now.getSeconds());

    const transactionData = {
      ...formData,
      amount: formData.category === 'FOOD STUFFS' 
        ? foodItems.reduce((total, item) => total + (parseFloat(item.price) || 0) * (parseInt(item.quantity) || 0), 0)
        : parseFloat(formData.amount),
      date: transactionDate.toISOString(), // Store full date and time
      foodItems: formData.category === 'FOOD STUFFS' ? foodItems : undefined,
    };

    if (editingTransaction) {
      dispatch({
        type: 'UPDATE_TRANSACTION',
        payload: { ...transactionData, id: editingTransaction.id }
      });
      setEditingTransaction(null);
    } else {
      dispatch({
        type: 'ADD_TRANSACTION',
        payload: { ...transactionData, id: Date.now() }
      });
    }

    setFormData({
      description: '',
      amount: '',
      type: 'expense',
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString('en-GB', {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit'
      }),
      category: '',
      person: '',
      paymentMethod: 'CASH',
    });
    
    onClose?.();
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'type' && {
        person: '',
        category: ''
      })
    }));
  };

  // Render different person input based on user type
  const renderPersonInput = () => {
    if (currentUser?.isAdmin) {
      // Admin sees dropdown with predefined names
      return (
        <select
          id="person"
          name="person"
          value={formData.person}
          onChange={handleChange}
          required
        >
          <option value="">Select a person</option>
          {formData.type === 'income' 
            ? MONEY_RECEIVERS.map(person => (
                <option key={person} value={person}>{person}</option>
              ))
            : MONEY_RECIPIENTS.map(person => (
                <option key={person} value={person}>{person}</option>
              ))
          }
        </select>
      );
    } else {
      // Regular users see text input
      return (
        <input
          type="text"
          id="person"
          name="person"
          value={formData.person}
          onChange={handleChange}
          placeholder={formData.type === 'income' ? "Enter sender's name" : "Enter recipient's name"}
          required
        />
      );
    }
  };

  return (
    <form onSubmit={handleSubmit} className={`transaction-form ${theme}`}>
      <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1" />
      <meta name="format-detection" content="telephone=no" />
      
      <h2>{editingTransaction ? 'Edit Transaction' : 'Add New Transaction'}</h2>
      
      <div className="form-group">
        <label htmlFor="type">Transaction Type</label>
        <select
          id="type"
          name="type"
          value={formData.type}
          onChange={handleChange}
          required
        >
          <option value="expense">Money Sent/Spent</option>
          <option value="income">Money Received</option>
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="person">
          {formData.type === 'expense' ? 'Sent To/Spent On' : 'Received From'}
        </label>
        {renderPersonInput()}
      </div>

      {formData.category === 'FOOD STUFFS' ? (
        <FoodItemsList items={foodItems} setItems={setFoodItems} />
      ) : (
        <div className="form-group">
          <label htmlFor="amount">Amount</label>
          <div className="amount-input-container">
            <input
              type="number"
              id="amount"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              min="0"
              step="0.01"
              required
              placeholder="0.00"
            />
          </div>
        </div>
      )}

      <div className="form-group">
        <label htmlFor="paymentMethod">Payment Method</label>
        <select
          id="paymentMethod"
          name="paymentMethod"
          value={formData.paymentMethod}
          onChange={handleChange}
          required
        >
          {PAYMENT_METHODS.map(method => (
            <option key={method} value={method}>{method}</option>
          ))}
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="category">Category</label>
        <select
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          required
        >
          <option value="">Select a category</option>
          {formData.type === 'income'
            ? INCOME_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))
            : EXPENSE_CATEGORIES.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))
          }
        </select>
      </div>

      <div className="form-group">
        <label htmlFor="description">Purpose/Note</label>
        <input
          type="text"
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          placeholder="Enter purpose of transaction (optional)"
        />
      </div>

      <div className="form-group">
        <label htmlFor="date">Date</label>
        <input
          type="date"
          id="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          required
        />
      </div>

      <div className="form-group time-display">
        <label>Time</label>
        <div className="current-time">
          {new Date().toLocaleTimeString('en-GB', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
          })}
        </div>
      </div>

      <div className="form-buttons">
        <button type="submit" className="submit-btn">
          {editingTransaction ? 'Update Transaction' : 'Add Transaction'}
        </button>
        <button 
          type="button" 
          className="cancel-btn"
          onClick={() => {
            setEditingTransaction?.(null);
            onClose?.();
          }}
        >
          Cancel
        </button>
      </div>
    </form>
  );
}

export default TransactionForm; 