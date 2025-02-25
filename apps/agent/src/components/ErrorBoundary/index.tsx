import { Component, ReactNode } from 'react';
import Button from '@breakout/design-system/components/layout/button';
import { trackError } from '@meaku/core/utils/error';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
}

class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
  };

  public static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  public componentDidCatch(error: Error) {
    trackError(error, {
      component: 'ErrorBoundary',
      action: 'componentDidCatch',
    });
  }

  private handleReload = () => {
    window.location.reload();
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="flex h-screen flex-col items-center justify-center gap-4">
          <p className="text-gray-700">Something went wrong. Please try again.</p>
          <Button onClick={this.handleReload}>Reload</Button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
