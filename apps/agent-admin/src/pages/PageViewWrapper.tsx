import { cn } from '@breakout/design-system/lib/cn';

// Define the HOC
const withPageViewWrapper = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  className?: string,
): React.FC<P> => {
  const ComponentWithWrapper: React.FC<P> = (props) => {
    return (
      <div className={cn('flex h-full w-full flex-col items-start gap-6 bg-white p-4', className)}>
        <WrappedComponent {...props} />
      </div>
    );
  };

  return ComponentWithWrapper;
};

export default withPageViewWrapper;
