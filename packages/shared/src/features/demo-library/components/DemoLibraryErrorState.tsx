import { Button, LucideIcon } from '@neuraltrade/saral';

interface DemoLibraryErrorStateProps {
  onRetry: () => void;
  error: Error;
}

export const DemoLibraryErrorState = ({ onRetry, error }: DemoLibraryErrorStateProps) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
      <LucideIcon name="alert-circle" className="w-16 h-16 text-red-400 mb-4" />
      <h3 className="text-lg font-semibold text-gray-900 mb-2">Failed to Load Demos</h3>
      <p className="text-gray-600 mb-4 max-w-md">
        We encountered an error while loading the demo library. Please try again.
      </p>
      <Button onClick={onRetry} variant="outline" className="flex items-center space-x-2">
        <LucideIcon name="refresh-cw" className="w-4 h-4" />
        <span>Try Again</span>
      </Button>
      {process.env.NODE_ENV === 'development' && (
        <details className="mt-4 text-left">
          <summary className="cursor-pointer text-sm text-gray-500">Error Details</summary>
          <pre className="mt-2 text-xs text-gray-600 bg-gray-100 p-2 rounded overflow-auto">{error.message}</pre>
        </details>
      )}
    </div>
  );
};
