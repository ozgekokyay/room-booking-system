

// src/context/PrivateRoute.js
import React from 'react';
import { Route, Navigate } from 'react-router-dom';
import { useAuth } from './AuthContext';

const PrivateRoute = ({ element, ...rest }) => {
  const { authTokens } = useAuth();

  return (
    <Route
      {...rest}
      element={authTokens ? element : <Navigate to="/login" replace />}
    />
  );
};

export default PrivateRoute;
