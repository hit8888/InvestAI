import { ListX } from 'lucide-react';

interface TableEmptyStateProps {
  hasFilters?: boolean;
  onClearFilters?: () => void;
  message?: string;
}

/**
 * Empty state for table
 * Shows different messages based on whether filters are applied
 * Matches the table's bordered design structure
 */
export const TableEmptyState = ({ hasFilters = false, onClearFilters, message }: TableEmptyStateProps) => {
  const defaultMessage = hasFilters ? 'No results found. Try adjusting your filters.' : 'No data available yet.';

  return (
    <div className="flex h-[calc(100vh-232px)] w-full max-w-full flex-col overflow-hidden rounded-md border border-gray-200 bg-white">
      {/* Table-style header */}
      <div className="bg-gray-100 px-4 py-3">
        <div className="text-xs font-medium tracking-wide text-gray-500">
          {hasFilters ? 'Filtered Results' : 'Table Data'}
        </div>
      </div>

      {/* Empty state content */}
      <div className="flex w-full flex-1 flex-col items-center justify-center py-12">
        <ListX className="mb-4 h-12 w-12 text-gray-300" />
        <h3 className="mb-2 text-lg font-semibold text-gray-900">{hasFilters ? 'No Results Found' : 'No Data'}</h3>
        <p className="mb-6 max-w-md text-center text-sm text-gray-600">{message || defaultMessage}</p>
        {hasFilters && onClearFilters && (
          <button
            onClick={onClearFilters}
            className="rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Clear Filters
          </button>
        )}
      </div>
    </div>
  );
};
