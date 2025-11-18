import React from 'react';
import Typography from '@breakout/design-system/components/Typography/index';
import Button from '@breakout/design-system/components/Button/index';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorStateProps {
  onRetry?: () => void;
  message?: string;
}

/**
 * Error state component for Blocks page
 * Displays an error message with an optional retry button
 */
const ErrorState = React.memo(({ onRetry, message = 'Failed to load Blocks. Please try again.' }: ErrorStateProps) => (
  <div className="flex w-full flex-col gap-6">
    <div className="flex-1 flex-col gap-2">
      <Typography variant="title-18">Blocks</Typography>
      <Typography variant="body-14" textColor="gray500">
        Manage and configure your website engagement blocks
      </Typography>
    </div>
    <div className="flex min-h-[400px] w-full items-center justify-center rounded-3xl border border-gray-200 bg-gray-25 p-12">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-red-50">
          <AlertCircle className="h-6 w-6 text-red-500" />
        </div>
        <div className="flex flex-col gap-2">
          <Typography variant="title-18" textColor="textPrimary">
            Something went wrong
          </Typography>
          <Typography variant="body-14" textColor="gray500">
            {message}
          </Typography>
        </div>
        {onRetry && (
          <Button
            size="medium"
            variant="primary"
            buttonStyle="leftIcon"
            leftIcon={<RefreshCw className="h-4 w-4" />}
            onClick={onRetry}
          >
            Try Again
          </Button>
        )}
      </div>
    </div>
  </div>
));

ErrorState.displayName = 'ErrorState';

export default ErrorState;
