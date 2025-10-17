import { FileQuestion } from 'lucide-react';

interface TableEmptyStateProps {
  hasFilters?: boolean;
  onClearFilters?: () => void;
  message?: string;
}

/**
 * Empty state for table
 * Shows different messages based on whether filters are applied
 */
export const TableEmptyState = ({ hasFilters = false, onClearFilters, message }: TableEmptyStateProps) => {
  const defaultMessage = hasFilters ? 'No results found. Try adjusting your filters.' : 'No data available yet.';

  return (
    <div className="flex min-h-[400px] w-full flex-col items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 py-12">
      <FileQuestion className="mb-4 h-12 w-12 text-gray-400" />
      <h3 className="mb-2 text-lg font-semibold text-gray-900">{hasFilters ? 'No Results Found' : 'No Data'}</h3>
      <p className="mb-4 text-sm text-gray-600">{message || defaultMessage}</p>
      {hasFilters && onClearFilters && (
        <button
          onClick={onClearFilters}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Clear Filters
        </button>
      )}
    </div>
  );
};
