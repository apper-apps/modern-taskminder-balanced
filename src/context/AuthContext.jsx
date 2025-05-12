import { createContext, useState, useContext, useEffect } from 'react';
import { toast } from 'react-toastify';

// Create the auth context
const AuthContext = createContext();

// Custom hook to use the auth context
export function useAuth() {
  return useContext(AuthContext);
}

// Provider component that wraps the app and makes auth object available to children
export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check local storage for existing user on initial load
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setCurrentUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  // Login function
  const login = (username, password) => {
    // This is a simple mock authentication
    // In a real app, you would call an API here
    if (username && password.length >= 4) {
      const user = { username };
      setCurrentUser(user);
      localStorage.setItem('user', JSON.stringify(user));
      toast.success('Login successful!');
      return true;
    } else {
      toast.error('Invalid credentials. Password must be at least 4 characters.');
      return false;
    }
  };

  // Logout function
  const logout = () => {
    setCurrentUser(null);
    localStorage.removeItem('user');
    toast.info('You have been logged out');
  };

  const value = {
    currentUser,
    login,
    logout,
    isAuthenticated: !!currentUser
  };

  return <AuthContext.Provider value={value}>{!loading && children}</AuthContext.Provider>;
}