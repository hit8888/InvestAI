import React, { JSX } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import { AppRoutesEnum } from '../utils/constants';

interface RouteWrapperProps {
  element: JSX.Element;
}

// Higher-Order Component for Protected Routes
const ProtectedRoute: React.FC<RouteWrapperProps> = ({ element }) => {
  const { isAuthenticated } = useAuth();
  const { LOGIN } = AppRoutesEnum;

  return isAuthenticated ? element : <Navigate to={`/${LOGIN}`} />;
};

export default ProtectedRoute;
