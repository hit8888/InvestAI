import AgentConfigHeader from './AgentConfigHeader.tsx';
import { ReactNode } from 'react';
import ErrorState from '@breakout/design-system/components/layout/ErrorState';
import { cn } from '@breakout/design-system/lib/cn';
import DataSourceLoadingState from './DataSourceLoadingState.tsx';

interface PageContainerProps {
  heading: string;
  subHeading?: string;
  children?: ReactNode;
  isLoading?: boolean;
  error?: Error | boolean | null;
  className?: string;
  containerClassName?: string;
}

const PageContainer = ({
  heading,
  subHeading,
  isLoading,
  error,
  children,
  className,
  containerClassName,
}: PageContainerProps) => {
  if (isLoading) return <DataSourceLoadingState heading={heading} subHeading={subHeading ?? ''} />;

  if (error) return <ErrorState />;

  return (
    <div className="flex w-full flex-shrink-0 flex-col items-start gap-4 bg-white p-14">
      <div className={cn('flex-start flex w-full flex-col gap-11 self-stretch', containerClassName)}>
        <AgentConfigHeader headerLabel={heading} subHeading={subHeading} />
        <div className={cn('flex max-w-2xl flex-col gap-12 self-stretch', className)}>{children}</div>
      </div>
    </div>
  );
};

export default PageContainer;
