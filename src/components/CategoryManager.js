import { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  MONEY_RECEIVERS, 
  MONEY_RECIPIENTS, 
  EXPENSE_CATEGORIES, 
  INCOME_CATEGORIES 
} from '../utils/constants';

function CategoryManager() {
  const [newCategory, setNewCategory] = useState('');
  const [categoryType, setCategoryType] = useState('expense');
  const [customCategories, setCustomCategories] = useState(() => {
    const saved = localStorage.getItem('customCategories');
    return saved ? JSON.parse(saved) : {
      receivers: [],
      recipients: [],
      expenses: [],
      income: []
    };
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (newCategory.trim()) {
      const category = newCategory.trim().toUpperCase();
      const updatedCategories = { ...customCategories };

      switch (categoryType) {
        case 'receiver':
          if (!MONEY_RECEIVERS.includes(category) && !customCategories.receivers.includes(category)) {
            updatedCategories.receivers = [...customCategories.receivers, category];
          }
          break;
        case 'recipient':
          if (!MONEY_RECIPIENTS.includes(category) && !customCategories.recipients.includes(category)) {
            updatedCategories.recipients = [...customCategories.recipients, category];
          }
          break;
        case 'expense':
          if (!EXPENSE_CATEGORIES.includes(category) && !customCategories.expenses.includes(category)) {
            updatedCategories.expenses = [...customCategories.expenses, category];
          }
          break;
        case 'income':
          if (!INCOME_CATEGORIES.includes(category) && !customCategories.income.includes(category)) {
            updatedCategories.income = [...customCategories.income, category];
          }
          break;
        default:
          break;
      }

      setCustomCategories(updatedCategories);
      localStorage.setItem('customCategories', JSON.stringify(updatedCategories));
      setNewCategory('');
    }
  };

  const removeCategory = (type, category) => {
    const updatedCategories = { ...customCategories };
    switch (type) {
      case 'receiver':
        updatedCategories.receivers = customCategories.receivers.filter(c => c !== category);
        break;
      case 'recipient':
        updatedCategories.recipients = customCategories.recipients.filter(c => c !== category);
        break;
      case 'expense':
        updatedCategories.expenses = customCategories.expenses.filter(c => c !== category);
        break;
      case 'income':
        updatedCategories.income = customCategories.income.filter(c => c !== category);
        break;
      default:
        break;
    }
    setCustomCategories(updatedCategories);
    localStorage.setItem('customCategories', JSON.stringify(updatedCategories));
  };

  return (
    <motion.div 
      className="category-manager glass"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2>Manage Categories</h2>
      
      <div className="categories-grid">
        <div className="category-section">
          <h3>Money Receivers</h3>
          <div className="category-list">
            {[...MONEY_RECEIVERS, ...customCategories.receivers].map(cat => (
              <motion.div 
                key={cat} 
                className="category-tag"
                whileHover={{ scale: 1.05 }}
              >
                {cat}
                {customCategories.receivers.includes(cat) && (
                  <button 
                    className="remove-category"
                    onClick={() => removeCategory('receiver', cat)}
                  >
                    ×
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="category-section">
          <h3>Money Recipients</h3>
          <div className="category-list">
            {[...MONEY_RECIPIENTS, ...customCategories.recipients].map(cat => (
              <motion.div 
                key={cat} 
                className="category-tag"
                whileHover={{ scale: 1.05 }}
              >
                {cat}
                {customCategories.recipients.includes(cat) && (
                  <button 
                    className="remove-category"
                    onClick={() => removeCategory('recipient', cat)}
                  >
                    ×
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="category-section">
          <h3>Expense Categories</h3>
          <div className="category-list">
            {[...EXPENSE_CATEGORIES, ...customCategories.expenses].map(cat => (
              <motion.div 
                key={cat} 
                className="category-tag"
                whileHover={{ scale: 1.05 }}
              >
                {cat}
                {customCategories.expenses.includes(cat) && (
                  <button 
                    className="remove-category"
                    onClick={() => removeCategory('expense', cat)}
                  >
                    ×
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        </div>

        <div className="category-section">
          <h3>Income Categories</h3>
          <div className="category-list">
            {[...INCOME_CATEGORIES, ...customCategories.income].map(cat => (
              <motion.div 
                key={cat} 
                className="category-tag"
                whileHover={{ scale: 1.05 }}
              >
                {cat}
                {customCategories.income.includes(cat) && (
                  <button 
                    className="remove-category"
                    onClick={() => removeCategory('income', cat)}
                  >
                    ×
                  </button>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="add-category-form">
        <select 
          value={categoryType} 
          onChange={(e) => setCategoryType(e.target.value)}
          className="category-type-select"
        >
          <option value="receiver">Add Money Receiver</option>
          <option value="recipient">Add Money Recipient</option>
          <option value="expense">Add Expense Category</option>
          <option value="income">Add Income Category</option>
        </select>
        
        <input
          type="text"
          value={newCategory}
          onChange={(e) => setNewCategory(e.target.value)}
          placeholder="Enter new category name"
          className="category-input"
        />
        
        <motion.button 
          type="submit" 
          className="submit-btn"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Add Category
        </motion.button>
      </form>
    </motion.div>
  );
}

export default CategoryManager; 