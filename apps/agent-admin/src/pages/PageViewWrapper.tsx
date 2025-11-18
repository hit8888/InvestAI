import { cn } from '@breakout/design-system/lib/cn';
import usePageRouteState from '../hooks/usePageRouteState';

// Define the HOC
const withPageViewWrapper = <P extends object>(
  WrappedComponent: React.ComponentType<P>,
  className?: string,
): React.FC<P> => {
  const ComponentWithWrapper: React.FC<P> = (props) => {
    const { isTableV2Page } = usePageRouteState();

    return (
      <div
        className={cn('flex w-full flex-col items-start gap-6', className, {
          // Remove bottom padding for scrollable pages (non-table pages)
          'pb-0': !isTableV2Page,
        })}
      >
        <WrappedComponent {...props} />
      </div>
    );
  };

  return ComponentWithWrapper;
};

export default withPageViewWrapper;
