import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthProvider';

interface RouteWrapperProps {
  element: JSX.Element;
}

// Higher-Order Component for Protected Routes
const ProtectedRoute: React.FC<RouteWrapperProps> = ({ element }) => {
  const { isAuthenticated } = useAuth();

  return isAuthenticated ? element : <Navigate to="/login" />;
};

export default ProtectedRoute;
