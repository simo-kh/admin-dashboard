import React from 'react';
import { Navigate } from 'react-router-dom';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token'); // Checks if a token exists in localStorage
  return token ? children : <Navigate to="/login" />; // Redirects to /login if not authenticated
};

export default PrivateRoute;
