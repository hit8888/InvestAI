import React from 'react';
import Card from '../../../components/AgentManagement/Card.tsx';
import PromptHeader from '../PromptHeader';

interface LoadingStateProps {
  title: string;
  description: string;
}

const LoadingState = React.memo(({ title, description }: LoadingStateProps) => (
  <div className="flex w-full flex-col items-start gap-4 self-stretch">
    <PromptHeader title={title} description={description} />
    <Card background={'GRAY25'} border={'GRAY200'}>
      <div className="flex items-center justify-center p-8">
        <div className="text-gray-500">Loading ICP configuration...</div>
      </div>
    </Card>
  </div>
));

LoadingState.displayName = 'LoadingState';

export default LoadingState;
