// src/context/AuthContext.js

import React, { createContext, useState, useContext } from 'react';

const AuthContext = createContext();

// Default user credentials
const defaultUser = {
  username: '1',
  password: '1',
};

export const AuthProvider = ({ children }) => {
  const [authTokens, setAuthTokens] = useState(localStorage.getItem('tokens'));

  const login = (username, password) => {
    if (username === defaultUser.username && password === defaultUser.password) {
      const tokens = 'validToken'; // This can be any string representing a token
      localStorage.setItem('tokens', tokens);
      setAuthTokens(tokens);
      return true;
    } else {
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('tokens');
    setAuthTokens(null);
  };

  return (
    <AuthContext.Provider value={{ authTokens, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);

export default AuthContext;
