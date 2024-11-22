import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaMoneyBillWave } from 'react-icons/fa';

const ADMIN_CREDENTIALS = {
  username: 'hanamel',
  password: 'achumboro'
};

const ADMIN_ACCESS_NAMES = [
  'NITA',
  'MRS ACHUMBORO',
  'GEORGINA',
  'GERTRUDE',
  'MR ACHUMBORO'
];

function Login({ onLogin }) {
  const [isRegistering, setIsRegistering] = useState(false);
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');

  useEffect(() => {
    const savedUser = localStorage.getItem('currentUser');
    if (savedUser) {
      onLogin(JSON.parse(savedUser));
    }
  }, [onLogin]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (credentials.username === ADMIN_CREDENTIALS.username && 
        credentials.password === ADMIN_CREDENTIALS.password) {
      const adminUser = {
        id: 'admin',
        username: credentials.username,
        isAdmin: true,
        accessibleNames: ADMIN_ACCESS_NAMES
      };
      localStorage.setItem('currentUser', JSON.stringify(adminUser));
      onLogin(adminUser);
      return;
    }

    if (isRegistering) {
      const existingUsers = JSON.parse(localStorage.getItem('users') || '[]');
      if (existingUsers.some(user => user.username === credentials.username)) {
        setError('Username already exists');
        return;
      }

      const newUser = {
        id: Date.now().toString(),
        username: credentials.username,
        password: credentials.password,
        isAdmin: false,
        isBlocked: false
      };

      localStorage.setItem('users', JSON.stringify([...existingUsers, newUser]));
      localStorage.setItem('currentUser', JSON.stringify(newUser));
      onLogin(newUser);
    } else {
      const users = JSON.parse(localStorage.getItem('users') || '[]');
      const user = users.find(u => 
        u.username === credentials.username && 
        u.password === credentials.password
      );

      if (user) {
        if (user.isBlocked) {
          setError('Your account has been blocked. Please contact the administrator.');
          return;
        }
        localStorage.setItem('currentUser', JSON.stringify(user));
        onLogin(user);
      } else {
        setError('Invalid username or password');
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <div className="login-logo">
          <FaMoneyBillWave className="logo-icon" />
        </div>
        <h1 className="welcome-text">
          Welcome toHanamel's<br />
          Expenses Tracker
        </h1>

        <form onSubmit={handleSubmit} className="login-form">
          <input
            type="text"
            placeholder="Username"
            value={credentials.username}
            onChange={(e) => setCredentials({
              ...credentials,
              username: e.target.value
            })}
            required
          />

          <input
            type="password"
            placeholder="Password"
            value={credentials.password}
            onChange={(e) => setCredentials({
              ...credentials,
              password: e.target.value
            })}
            required
          />

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <button type="submit" className="login-btn">
            Login
          </button>
        </form>

        <button
          className="toggle-auth-btn"
          onClick={() => {
            setIsRegistering(!isRegistering);
            setError('');
            setCredentials({ username: '', password: '' });
          }}
        >
          Need an account? Register
        </button>
      </div>
    </div>
  );
}

export default Login; 