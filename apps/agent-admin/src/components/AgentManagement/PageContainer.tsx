import AgentConfigHeader from './AgentConfigHeader.tsx';
import { ReactNode } from 'react';

interface PageContainerProps {
  heading: string;
  subHeading?: string;
  children?: ReactNode;
  isLoading?: boolean;
  error?: Error | null;
}

const PageContainer = ({ heading, subHeading, isLoading, error, children }: PageContainerProps) => {
  // TODO: Implement Loading and Error states
  if (error) return <div>Error</div>;

  if (isLoading)
    return (
      <div className="flex w-full flex-shrink-0 flex-col items-start gap-4 bg-white p-14">
        <div className="flex-start flex w-full flex-col gap-11 self-stretch">
          <AgentConfigHeader headerLabel={heading} subHeading={subHeading} />
          <div className="flex max-w-2xl flex-col gap-12 self-stretch">Loading....</div>
        </div>
      </div>
    );

  return (
    <div className="flex w-full flex-shrink-0 flex-col items-start gap-4 bg-white p-14">
      <div className="flex-start flex w-full flex-col gap-11 self-stretch">
        <AgentConfigHeader headerLabel={heading} subHeading={subHeading} />
        <div className="flex max-w-2xl flex-col gap-12 self-stretch">{children}</div>
      </div>
    </div>
  );
};

export default PageContainer;
