import React, { JSX } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useSessionStore } from '../stores/useSessionStore';
import { AppRoutesEnum } from '../utils/constants';

interface RouteWrapperProps {
  element: JSX.Element;
}

// Higher-Order Component for Protected Routes
const ProtectedRoute: React.FC<RouteWrapperProps> = ({ element }) => {
  const isAuthenticated = useSessionStore((state) => state.isAuthenticated);
  const location = useLocation();

  if (!isAuthenticated) {
    const currentPath = location.pathname + location.search;
    localStorage.setItem('redirectAfterLogin', JSON.stringify(currentPath));

    return <Navigate to={`/${AppRoutesEnum.LOGIN}`} />;
  }

  return element;
};

export default ProtectedRoute;
