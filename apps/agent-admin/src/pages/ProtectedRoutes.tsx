import React, { JSX } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';
import { AppRoutesEnum } from '../utils/constants';

interface RouteWrapperProps {
  element: JSX.Element;
}

// Higher-Order Component for Protected Routes
const ProtectedRoute: React.FC<RouteWrapperProps> = ({ element }) => {
  const { isAuthenticated } = useAuth();
  const { LOGIN } = AppRoutesEnum;
  const location = useLocation();

  if (!isAuthenticated) {
    // Save the attempted URL in localStorage
    localStorage.setItem('redirectAfterLogin', JSON.stringify(location.pathname));
    return <Navigate to={`/${LOGIN}`} />;
  }

  return element;
};

export default ProtectedRoute;
