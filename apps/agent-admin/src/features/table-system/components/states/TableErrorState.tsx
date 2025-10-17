import { AlertTriangle } from 'lucide-react';

interface TableErrorStateProps {
  error: Error;
  onRetry?: () => void;
}

/**
 * Error state for table
 * Shows error message with optional retry button
 */
export const TableErrorState = ({ error, onRetry }: TableErrorStateProps) => {
  return (
    <div className="flex min-h-[400px] w-full flex-col items-center justify-center rounded-lg border-2 border-red-200 bg-red-50 py-12">
      <AlertTriangle className="mb-4 h-12 w-12 text-red-600" />
      <h3 className="mb-2 text-lg font-semibold text-red-900">Error Loading Data</h3>
      <p className="mb-4 max-w-md text-center text-sm text-red-700">
        {error.message || 'An unexpected error occurred while loading the table data.'}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          className="rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white hover:bg-red-700"
        >
          Try Again
        </button>
      )}
    </div>
  );
};
