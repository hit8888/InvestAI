import React, { Component, ReactNode } from 'react';
import { trackError } from '../../../utils/error.ts';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Optionally, log the error or use it in the state
    trackError(error, {
      action: 'getDerivedStateFromError',
      component: 'ErrorBoundary',
    });
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // You can log the error to an error reporting service here if needed
    console.error('ErrorBoundary caught an error:', error, errorInfo);
    trackError(error, {
      action: 'getDerivedStateFromError',
      component: 'ErrorBoundary',
      additionalData: { errorInfo },
    });
  }

  render() {
    if (this.state.hasError) {
      // Render nothing if an error occurs
      return null;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
