import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaMoneyBillWave, FaUser, FaLock, FaSignInAlt } from 'react-icons/fa';
import { auth, db } from '../firebase';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
import { doc, setDoc, getDoc, getDocs, collection } from 'firebase/firestore';
import './Login.css';

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

  const createEmailFromUsername = (username) => {
    return `${username.toLowerCase().replace(/\s+/g, '')}@hanamels.com`;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      if (credentials.username === ADMIN_CREDENTIALS.username && 
          credentials.password === ADMIN_CREDENTIALS.password) {
        const adminUser = {
          id: 'admin',
          username: credentials.username,
          isAdmin: true,
          accessibleNames: ADMIN_ACCESS_NAMES,
          createdAt: new Date().getTime()
        };

        try {
          await setDoc(doc(db, 'users', 'admin'), adminUser, { merge: true });
        } catch (error) {
          console.error('Error storing admin data:', error);
        }

        localStorage.setItem('currentUser', JSON.stringify(adminUser));
        onLogin(adminUser);
        return;
      }

      const email = createEmailFromUsername(credentials.username);

      if (isRegistering) {
        const usersSnapshot = await getDocs(collection(db, 'users'));
        const userExists = usersSnapshot.docs.some(
          doc => doc.data().username.toLowerCase() === credentials.username.toLowerCase()
        );

        if (userExists) {
          setError('Username already exists');
          return;
        }

        const userCredential = await createUserWithEmailAndPassword(
          auth, 
          email,
          credentials.password
        );

        const newUser = {
          id: userCredential.user.uid,
          username: credentials.username,
          email: email,
          isAdmin: false,
          isBlocked: false,
          createdAt: new Date().getTime()
        };

        await setDoc(doc(db, 'users', userCredential.user.uid), newUser);
        localStorage.setItem('currentUser', JSON.stringify(newUser));
        onLogin(newUser);
      } else {
        const userCredential = await signInWithEmailAndPassword(
          auth,
          email,
          credentials.password
        );

        const userDoc = await getDoc(doc(db, 'users', userCredential.user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          if (userData.isBlocked) {
            setError('Your account has been blocked. Please contact the administrator.');
            return;
          }
          localStorage.setItem('currentUser', JSON.stringify(userData));
          onLogin(userData);
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        setError('Invalid username or password');
      } else if (error.code === 'auth/email-already-in-use') {
        setError('Username already exists');
      } else {
        setError('An error occurred. Please try again.');
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
          {isRegistering ? 'Sign Up' : 'Login'}
          <span>Welcome to Hanamel's Expenses Tracker</span>
        </h1>

        <form onSubmit={handleSubmit} className="login-form">
          <div className="input-container">
            <FaUser className="input-icon" />
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
          </div>

          <div className="input-container">
            <FaLock className="input-icon" />
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
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          <motion.button 
            type="submit" 
            className="login-btn"
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
        >
          {isRegistering ? 'Already have an account? Login' : 'Need an account? Register'}
        </motion.button>
      </div>
    </div>
  );
}

export default Login; 