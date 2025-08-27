import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from localStorage
  useEffect(() => {
    const initAuth = () => {
      const storedToken = localStorage.getItem('token');
      const storedUser = localStorage.getItem('user');

      if (storedToken && storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          
          // Check if token is expired (JWT tokens expire after 7 days)
          const tokenData = JSON.parse(atob(storedToken.split('.')[1]));
          const currentTime = Date.now() / 1000;
          
          if (tokenData.exp > currentTime) {
            // Token is valid
            setToken(storedToken);
            setUser(userData);
            
            // Set axios default header
            axios.defaults.headers.common['Authorization'] = `Bearer ${storedToken}`;
          } else {
            // Token expired, clear storage
            logout();
          }
        } catch (error) {
          console.error('Error parsing stored auth data:', error);
          logout();
        }
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  // Login function
  const login = async (email, password) => {
    try {
      const response = await axios.post('http://localhost:5000/api/users/login', {
        email,
        password,
      });

      const { user: userData, token: authToken, message } = response.data;

      // Store in state and localStorage
      setUser(userData);
      setToken(authToken);
      localStorage.setItem('token', authToken);
      localStorage.setItem('user', JSON.stringify(userData));

      // Set axios default authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;

      return { success: true, message, user: userData };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Login failed';
      return { success: false, error: errorMessage };
    }
  };

  // Signup function
  const signup = async (userData) => {
    try {
      const response = await axios.post('http://localhost:5000/api/users/register', userData);

      const { user: newUser, token: authToken, message } = response.data;

      // Store in state and localStorage
      setUser(newUser);
      setToken(authToken);
      localStorage.setItem('token', authToken);
      localStorage.setItem('user', JSON.stringify(newUser));

      // Set axios default authorization header
      axios.defaults.headers.common['Authorization'] = `Bearer ${authToken}`;

      return { success: true, message, user: newUser };
    } catch (error) {
      const errorMessage = error.response?.data?.error || 'Signup failed';
      return { success: false, error: errorMessage };
    }
  };

  // Logout function
  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    // Remove axios default header
    delete axios.defaults.headers.common['Authorization'];
  };

  // Check if user is admin
  const isAdmin = () => {
    return user && user.role === 'admin';
  };

  // Check if user is authenticated
  const isAuthenticated = () => {
    return !!user && !!token;
  };

  // Update user profile
  const updateProfile = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    token,
    isLoading,
    login,
    signup,
    logout,
    isAdmin,
    isAuthenticated,
    updateProfile,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}; 