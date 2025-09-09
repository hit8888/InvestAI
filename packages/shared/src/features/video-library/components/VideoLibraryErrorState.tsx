import { useState } from 'react';
import { Button, Icons } from '@meaku/saral';

interface VideoLibraryErrorStateProps {
  onRetry?: () => void;
  error?: Error | null;
}

export const VideoLibraryErrorState = ({ onRetry, error }: VideoLibraryErrorStateProps) => {
  const [isRetrying, setIsRetrying] = useState(false);

  const handleRetry = async () => {
    if (onRetry) {
      setIsRetrying(true);
      try {
        await onRetry();
      } finally {
        setIsRetrying(false);
      }
    }
  };

  return (
    <div className="flex items-center justify-center h-full">
      <div className="text-center text-muted-foreground">
        <Icons.AlertCircle className="h-16 w-16 mx-auto mb-4 text-destructive-600" />
        <p className="text-sm mb-2">Failed to load videos</p>
        {error && (
          <p className="text-xs text-gray-500 mb-4 max-w-xs">
            {error.message || 'Something went wrong while loading the video library.'}
          </p>
        )}
        {onRetry && (
          <Button onClick={handleRetry} disabled={isRetrying} className="flex items-center gap-2 mx-auto">
            {isRetrying && <Icons.Loader className="h-4 w-4 animate-spin" />}
            {isRetrying ? 'Retrying...' : 'Try Again'}
          </Button>
        )}
      </div>
    </div>
  );
};
