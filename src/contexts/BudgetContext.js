import React, { createContext, useContext, useReducer, useEffect } from 'react';

const BudgetContext = createContext();

const initialState = {
  transactions: [],
  balance: 0,
  totalIncome: 0,
  totalExpenses: 0,
};

// Load state from localStorage with user-specific key
const loadState = (userId) => {
  try {
    const savedState = localStorage.getItem(`budgetState_${userId}`);
    return savedState ? JSON.parse(savedState) : initialState;
  } catch (error) {
    console.error('Error loading state:', error);
    return initialState;
  }
};

function budgetReducer(state, action) {
  let newState;
  
  switch (action.type) {
    case 'ADD_TRANSACTION':
      newState = {
        ...state,
        transactions: [action.payload, ...state.transactions],
        balance: action.payload.type === 'income' 
          ? state.balance + action.payload.amount 
          : state.balance - action.payload.amount,
        totalIncome: action.payload.type === 'income' 
          ? state.totalIncome + action.payload.amount 
          : state.totalIncome,
        totalExpenses: action.payload.type === 'expense' 
          ? state.totalExpenses + action.payload.amount 
          : state.totalExpenses,
      };
      break;
    
    case 'DELETE_TRANSACTION':
      const transactionToDelete = state.transactions.find(t => t.id === action.payload);
      newState = {
        ...state,
        transactions: state.transactions.filter(t => t.id !== action.payload),
        balance: transactionToDelete.type === 'income'
          ? state.balance - transactionToDelete.amount
          : state.balance + transactionToDelete.amount,
        totalIncome: transactionToDelete.type === 'income'
          ? state.totalIncome - transactionToDelete.amount
          : state.totalIncome,
        totalExpenses: transactionToDelete.type === 'expense'
          ? state.totalExpenses - transactionToDelete.amount
          : state.totalExpenses,
      };
      break;

    case 'UPDATE_TRANSACTION':
      const updatedTransactions = state.transactions.map(t => 
        t.id === action.payload.id ? action.payload : t
      );
      
      newState = {
        ...state,
        transactions: updatedTransactions,
        balance: calculateBalance(updatedTransactions),
        totalIncome: calculateTotalIncome(updatedTransactions),
        totalExpenses: calculateTotalExpenses(updatedTransactions),
      };
      break;

    default:
      return state;
  }

  // Save to localStorage with user-specific key
  localStorage.setItem(`budgetState_${action.userId}`, JSON.stringify(newState));
  return newState;
}

// Helper functions for recalculating totals
const calculateBalance = (transactions) => 
  transactions.reduce((acc, t) => 
    t.type === 'income' ? acc + t.amount : acc - t.amount, 0);

const calculateTotalIncome = (transactions) =>
  transactions.reduce((acc, t) => 
    t.type === 'income' ? acc + t.amount : acc, 0);

const calculateTotalExpenses = (transactions) =>
  transactions.reduce((acc, t) => 
    t.type === 'expense' ? acc + t.amount : acc, 0);

export const BudgetProvider = ({ children, userId }) => {
  const [state, dispatch] = useReducer(
    budgetReducer, 
    initialState, 
    () => loadState(userId)
  );

  // Wrap dispatch to include userId
  const dispatchWithUser = (action) => {
    dispatch({ ...action, userId });
  };

  return (
    <BudgetContext.Provider value={{ state, dispatch: dispatchWithUser }}>
      {children}
    </BudgetContext.Provider>
  );
};

export const useBudget = () => useContext(BudgetContext); 