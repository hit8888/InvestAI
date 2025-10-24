import React from 'react';
import { Skeleton } from '@breakout/design-system/components/shadcn-ui/skeleton';
import Typography from '@breakout/design-system/components/Typography/index';

/**
 * Loading state component for AI Blocks page
 * Displays skeleton loaders while data is being fetched
 */
const LoadingState = React.memo(() => (
  <div className="flex w-full flex-col gap-6">
    <div className="flex-1 flex-col gap-2">
      <Typography variant="title-18">AI Blocks</Typography>
      <Typography variant="body-14" textColor="gray500">
        Manage and configure your website engagement blocks
      </Typography>
    </div>
    <div className="flex w-full items-start gap-6">
      <div className="flex flex-1 flex-col items-start gap-6">
        {[...Array(5)].map((_, index) => (
          <Skeleton key={index} className="h-24 w-full rounded-2xl" />
        ))}
      </div>
      <div className="h-[400px] w-[400px]">
        <Skeleton className="h-full w-full" />
      </div>
    </div>
  </div>
));

LoadingState.displayName = 'LoadingState';

export default LoadingState;
