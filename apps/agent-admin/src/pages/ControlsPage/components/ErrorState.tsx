import React from 'react';
import Card from '../../../components/AgentManagement/Card.tsx';
import PromptHeader from '../PromptHeader';

interface ErrorStateProps {
  title: string;
  description: string;
}

const ErrorState = React.memo(({ title, description }: ErrorStateProps) => {
  return (
    <div className="flex w-full flex-col items-start gap-4 self-stretch">
      <PromptHeader title={title} description={description} />
      <Card background={'GRAY25'} border={'GRAY200'}>
        <div className="flex items-center justify-center p-8">
          <div className="text-red-500">Error loading ICP configuration. Please try again.</div>
        </div>
      </Card>
    </div>
  );
});

ErrorState.displayName = 'ErrorState';

export default ErrorState;
