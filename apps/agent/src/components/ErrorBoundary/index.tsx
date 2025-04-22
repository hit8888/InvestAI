import { Component, ReactNode } from 'react';
import { trackError } from '@meaku/core/utils/error';

interface Props {
  children: ReactNode;
  // Add context props
  mode?: 'bottomBar' | 'embed' | 'overlay';
  agentId?: string;
  onError?: (error: Error, errorInfo: { componentStack: string }) => void;
}

interface State {
  hasError: boolean;
  error?: Error;
  errorInfo?: { componentStack: string };
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: { componentStack: string }) {
    this.setState({ error, errorInfo });

    trackError(error, {
      component: 'ErrorBoundary',
      action: 'componentDidCatch',
      additionalData: {
        mode: this.props.mode,
        agentId: this.props.agentId,
      },
    });

    // Call parent error handler with context
    if (this.props.onError) {
      this.props.onError(error, errorInfo);
    }
  }

  public render() {
    if (this.state.hasError) {
      return null;
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
