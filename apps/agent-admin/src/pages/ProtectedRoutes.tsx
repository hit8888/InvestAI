import React, { JSX, useEffect } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import { AppRoutesEnum } from '../utils/constants';

interface RouteWrapperProps {
  element: JSX.Element;
}

// Higher-Order Component for Protected Routes
const ProtectedRoute: React.FC<RouteWrapperProps> = ({ element }) => {
  const { isAuthenticated, clearTokens } = useAuth();
  const { LOGIN } = AppRoutesEnum;
  const navigate = useNavigate();
  const refreshTokenExpiry = parseInt(localStorage.getItem('refreshTokenExpiry') || '0');

  // When user directly comes to paste the URL, we need to check if refresh token is valid
  useEffect(() => {
    if (Date.now() > refreshTokenExpiry) {
      clearTokens();
      navigate(LOGIN); // Refresh token expired
    }
  }, []);

  return isAuthenticated ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;
