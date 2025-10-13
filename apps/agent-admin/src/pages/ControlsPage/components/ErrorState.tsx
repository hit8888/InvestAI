import React from 'react';
import Card from '../../../components/AgentManagement/Card.tsx';
import PromptHeader from '../PromptHeader';
import Typography from '@breakout/design-system/components/Typography/index';
import Button from '@breakout/design-system/components/Button/index';

interface ErrorStateProps {
  title: string;
  description: string;
  refetch: () => void;
  errorMessage: string;
}

const ErrorState = React.memo(({ title, description, refetch, errorMessage }: ErrorStateProps) => {
  return (
    <div className="flex w-full flex-col items-start gap-4 self-stretch">
      <PromptHeader title={title} description={description} />
      <Card background={'GRAY25'} border={'GRAY200'}>
        <div className="flex items-center justify-center gap-3 p-8">
          <Typography textColor="error">{errorMessage}</Typography>
          <Button variant="primary" onClick={() => refetch()}>
            Try Again
          </Button>
        </div>
      </Card>
    </div>
  );
});

ErrorState.displayName = 'ErrorState';

export default ErrorState;
