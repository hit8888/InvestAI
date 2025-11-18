import { ChevronLeft, ChevronRight } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@breakout/design-system/components/layout/select';

interface GenericTablePaginationProps {
  currentPage: number;
  pageSize: number;
  totalPages: number;
  totalRecords: number;
  pageSizeOptions: number[];
  onPageChange: (page: number) => void;
  onPageSizeChange: (size: number) => void;
  isLoading?: boolean;
  isFetching?: boolean;
}

/**
 * Table pagination component
 * Shows page controls, page size selector, and record counts
 */
export const GenericTablePagination = ({
  currentPage,
  pageSize,
  totalPages,
  totalRecords,
  pageSizeOptions,
  onPageChange,
  onPageSizeChange,
  isLoading = false,
  isFetching = false,
}: GenericTablePaginationProps) => {
  const startRecord = totalRecords === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endRecord = Math.min(currentPage * pageSize, totalRecords);

  const isDisabled = isLoading || isFetching;
  const canGoPrevious = currentPage > 1 && !isDisabled;
  const canGoNext = currentPage < totalPages && !isDisabled;

  return (
    <div className="flex items-center justify-end gap-6 px-4">
      {/* Page size selector */}
      <div className="flex items-center gap-2">
        <Select
          value={String(pageSize)}
          onValueChange={(value) => onPageSizeChange(Number(value))}
          disabled={isDisabled}
        >
          <SelectTrigger className="h-9 w-[180px] text-sm">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {pageSizeOptions.map((size) => (
              <SelectItem key={size} value={String(size)}>
                {size} rows per page
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Records info */}
      <div className="text-sm text-gray-700">
        {startRecord.toLocaleString()} - {endRecord.toLocaleString()} of {totalRecords.toLocaleString()}
      </div>

      {/* Page navigation */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={!canGoPrevious}
          className="rounded-md border border-gray-300 p-2 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Previous page"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={!canGoNext}
          className="rounded-md border border-gray-300 p-2 hover:bg-gray-50 disabled:cursor-not-allowed disabled:opacity-50"
          aria-label="Next page"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};
