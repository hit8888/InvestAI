import React, { Component, ReactNode } from 'react';
import { trackError } from '@neuraltrade/core/utils/error';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  isSmallScreen: boolean;
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = {
      hasError: false,
      isSmallScreen: window.matchMedia('(max-width: 450px)').matches,
    };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    // Optionally, log the error or use it in the state
    trackError(error, {
      action: 'getDerivedStateFromError',
      component: 'ErrorBoundary',
    });
    return { hasError: true, isSmallScreen: false };
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

  componentDidMount() {
    this.handleResize = this.handleResize.bind(this);
    window.addEventListener('resize', this.handleResize);
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  handleResize() {
    this.setState({
      isSmallScreen: window.matchMedia('(max-width: 450px)').matches,
    });
  }

  render() {
    const { hasError } = this.state;

    if (hasError) {
      // Render nothing if an error occurs
      return null;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
