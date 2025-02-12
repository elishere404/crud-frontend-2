import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

// Set the default API base URL for axios
axios.defaults.baseURL = 'https://express-auth-api-one.vercel.app';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));

  // This will run whenever the token is updated
  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token);
      axios.defaults.headers.common['x-auth-token'] = token;
      
      // Decode the token to get user data (e.g., user ID)
      const decoded = decodeToken(token);
      setUser(decoded);
    } else {
      localStorage.removeItem('token');
      delete axios.defaults.headers.common['x-auth-token'];
    }
  }, [token]);

  const decodeToken = (token) => {
    try {
      const payload = JSON.parse(atob(token.split('.')[1]));
      return payload; 
    } catch (error) {
      console.error('Error decoding token:', error);
      return null;
    }
  };

  const login = async (email, password) => {
    try {
      const response = await axios.post('https://express-auth-api-one.vercel.app/users/login', { email, password });
      setToken(response.data.token);
      return true;
    } catch (error) {
      console.error('Login error:', error);
      throw error;
    }
  };

  const register = async (username, email, password) => {
    try {
      const response = await axios.post('https://express-auth-api-one.vercel.app/users/register', { username, email, password });
      return response.data;
    } catch (error) {
      console.error('Registration error:', error);
      throw error;
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        register,
        isAuthenticated: !!token,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
