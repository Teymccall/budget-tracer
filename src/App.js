import { BrowserRouter as Router } from 'react-router-dom';
import { ThemeProvider } from './contexts/ThemeContext';
import { BudgetProvider } from './contexts/BudgetContext';
import { Routes, Route } from 'react-router-dom';
import { useState, useEffect } from 'react';
import './App.css';

import Dashboard from './pages/Dashboard';
import Navbar from './components/Navbar';
import Transactions from './pages/Transactions';
import TransactionForm from './components/TransactionForm';
import Login from './components/Login';

function App() {
  const [showForm, setShowForm] = useState(false);
  const [user, setUser] = useState(null);

  // Check if user is blocked
  useEffect(() => {
    if (user && user.id !== 'admin') {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const currentUser = users.find(u => u.id === user.id);
      
      if (currentUser?.isBlocked) {
        handleLogout();
      }
    }
  }, [user]);

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    setUser(null);
  };

  if (!user) {
    return <Login onLogin={setUser} />;
  }

  return (
    <ThemeProvider>
      <BudgetProvider userId={user.id}>
        <Router>
          <div className="App">
            <Navbar 
              onAddTransaction={() => setShowForm(true)} 
              onLogout={handleLogout}
              username={user.username}
            />
            
            {showForm && (
              <div className="modal-overlay" onClick={(e) => {
                if (e.target.className === 'modal-overlay') {
                  setShowForm(false);
                }
              }}>
                <div className="modal-content">
                  <TransactionForm 
                    onClose={() => setShowForm(false)}
                  />
                </div>
              </div>
            )}

            <div className="main-content">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/transactions" element={<Transactions />} />
              </Routes>
            </div>
          </div>
        </Router>
      </BudgetProvider>
    </ThemeProvider>
  );
}

export default App;
