import React from 'react';
import Card from '../../../components/AgentManagement/Card.tsx';
import PromptHeader from '../PromptHeader';
import { Skeleton } from '@breakout/design-system/components/shadcn-ui/skeleton';

interface LoadingStateProps {
  title: string;
  description: string;
}

const LoadingState = React.memo(({ title, description }: LoadingStateProps) => (
  <div className="flex w-full flex-col items-start gap-4 self-stretch">
    <PromptHeader title={title} description={description} />
    <Card background={'GRAY25'} border={'GRAY200'}>
      <div className="flex h-full w-full flex-col items-center justify-center gap-4 p-8">
        <Skeleton className="h-10 w-full rounded-lg bg-primary/20" />
        <Skeleton className="h-10 w-full rounded-lg bg-primary/20" />
        <Skeleton className="h-10 w-full rounded-lg bg-primary/20" />
      </div>
    </Card>
  </div>
));

LoadingState.displayName = 'LoadingState';

export default LoadingState;
