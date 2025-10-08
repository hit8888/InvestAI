import { Component, ReactNode, Suspense, ComponentType } from 'react';

type SuspenseErrorBoundaryProps = {
  children: ReactNode;
  fallback: ReactNode;
};

type SuspenseErrorBoundaryState = {
  hasError: boolean;
};

type SuspenseWrapperProps = {
  children: ReactNode;
  loadingFallback: ReactNode;
  errorFallback: ReactNode;
};

class SuspenseErrorBoundary extends Component<SuspenseErrorBoundaryProps, SuspenseErrorBoundaryState> {
  constructor(props: SuspenseErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): SuspenseErrorBoundaryState {
    return { hasError: true };
  }

  componentDidCatch(error: Error) {
    console.warn('Suspense loading failed:', error);
  }

  render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return null;
    }

    return this.props.children;
  }
}

const SuspenseWrapper = ({ children, loadingFallback, errorFallback }: SuspenseWrapperProps) => {
  return (
    <SuspenseErrorBoundary fallback={errorFallback || null}>
      <Suspense fallback={loadingFallback || null}>{children}</Suspense>
    </SuspenseErrorBoundary>
  );
};

type WithSuspenseWrapperOptions = {
  loadingFallback?: ReactNode;
  errorFallback?: ReactNode;
};

const withSuspenseWrapper = <P extends object>(
  WrappedComponent: ComponentType<P>,
  options: WithSuspenseWrapperOptions = {},
) => {
  const WithSuspenseWrapperComponent = (props: P) => {
    return (
      <SuspenseWrapper loadingFallback={options.loadingFallback} errorFallback={options.errorFallback}>
        <WrappedComponent {...props} />
      </SuspenseWrapper>
    );
  };

  // Set display name for better debugging
  WithSuspenseWrapperComponent.displayName = `withSuspenseWrapper(${WrappedComponent.displayName || WrappedComponent.name || 'Component'})`;

  return WithSuspenseWrapperComponent;
};

export default SuspenseWrapper;
export { withSuspenseWrapper };
