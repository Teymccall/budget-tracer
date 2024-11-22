import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaMoneyBillWave, FaUser, FaLock, FaSignInAlt } from 'react-icons/fa';

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
          Welcome to Hanamel's<br />
          Expenses Tracker
        </h1>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-container" style={{ 
            position: 'relative', 
            width: '100%', 
            maxWidth: '300px',
            marginBottom: '15px' 
          }}>
            <FaUser style={{ 
              position: 'absolute',
              left: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#666'
            }} />
            <input
              type="text"
              placeholder="Username"
              value={credentials.username}
              onChange={(e) => setCredentials({
                ...credentials,
                username: e.target.value
              })}
              required
              style={{ 
                width: '100%',
                padding: '12px',
                paddingLeft: '35px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                fontSize: '16px',
                outline: 'none'
              }}
            />
          </div>

          <div className="input-container" style={{ 
            position: 'relative', 
            width: '100%', 
            maxWidth: '300px',
            marginBottom: '15px' 
          }}>
            <FaLock style={{ 
              position: 'absolute',
              left: '10px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: '#666'
            }} />
            <input
              type="password"
              placeholder="Password"
              value={credentials.password}
              onChange={(e) => setCredentials({
                ...credentials,
                password: e.target.value
              })}
              required
              style={{ 
                width: '100%',
                padding: '12px',
                paddingLeft: '35px',
                borderRadius: '8px',
                border: '1px solid #ddd',
                fontSize: '16px',
                outline: 'none'
              }}
            />
          </div>

          {error && (
            <div className="error-message" style={{ 
              color: 'red',
              marginBottom: '10px',
              fontSize: '14px'
            }}>
              {error}
            </div>
          )}

          <motion.button 
            type="submit" 
            className="login-btn"
            style={{ 
              width: '50%',
              maxWidth: '150px',
              padding: '12px',
              borderRadius: '8px',
              border: 'none',
              backgroundColor: '#2563eb',
              color: 'white',
              fontSize: '16px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              margin: '0 auto',
              marginTop: '15px'
            }}
            whileHover={{ 
              scale: 1.02,
              backgroundColor: '#1d4ed8'
            }}
            whileTap={{ scale: 0.98 }}
            transition={{ duration: 0.2 }}
          >
            <FaSignInAlt />
            {isRegistering ? 'Register' : 'Login'}
          </motion.button>
        </form>

        <motion.button
          className="toggle-auth-btn"
          onClick={() => {
            setIsRegistering(!isRegistering);
            setError('');
            setCredentials({ username: '', password: '' });
          }}
          style={{
            background: 'none',
            border: 'none',
            color: '#2563eb',
            cursor: 'pointer',
            marginTop: '15px',
            fontSize: '14px'
          }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ duration: 0.2 }}
        >
          {isRegistering ? 'Already have an account? Login' : 'Need an account? Register'}
        </motion.button>
      </div>
    </div>
  );
}

export default Login; 