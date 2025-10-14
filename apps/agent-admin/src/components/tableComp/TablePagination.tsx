import React from 'react';
import CustomFilterDropdown from '@breakout/design-system/components/Dropdown/CustomFilterDropdown';
import PaginationNextArrow from '@breakout/design-system/components/icons/pagination-next-arrow';
import PaginationPreviousArrow from '@breakout/design-system/components/icons/pagination-previous-arrow';
import PaginationArrowButton from './PaginationArrowButton';
import useAdminEventAnalytics from '@meaku/core/hooks/useAdminEventAnalytics';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';
import TablePaginationShimmer from '../ShimmerComponent/TablePaginationShimmer';
import { PaginationPageType } from '@meaku/core/types/admin/admin';

interface PaginationProps {
  tableType: PaginationPageType;
  isLoading: boolean;
  paginationPerPageOptions: string[];
  totalItems: number; // Total number of items
  totalPages: number; // Total number of pages
  itemsPerPage: number; // Items per page
  currentPage: number; // Current page
  handlePageChange: (page: number) => void; // Callback function to handle page changes
  onItemsPerPageChange: (page: number) => void; // Callback function to handle ItemsPerPage changes
}

const TablePagination: React.FC<PaginationProps> = ({
  tableType,
  isLoading,
  paginationPerPageOptions,
  totalItems,
  totalPages,
  itemsPerPage,
  onItemsPerPageChange,
  handlePageChange,
  currentPage,
}) => {
  const { trackAdminEvent } = useAdminEventAnalytics();

  const handlePerPageOperation = (selectedOption: string | null) => {
    onItemsPerPageChange(Number(selectedOption));
    trackAdminEvent(ANALYTICS_EVENT_NAMES.TABLE_PAGINATION_PER_PAGE_CHANGE, {
      itemsPerPage: Number(selectedOption),
      tableType,
    });
  };

  const isFirstPage = currentPage === 1;
  const isLastPage = totalPages === 0 || currentPage === totalPages;

  if (isLoading) {
    return <TablePaginationShimmer />;
  }

  if (totalItems === 0) {
    return null;
  }

  const showPaginationControls = totalPages > 1;

  return (
    <div className="sticky bottom-0 z-10 flex items-center justify-end gap-4 self-stretch bg-white p-4">
      {showPaginationControls && (
        <div className="flex items-start gap-2">
          {/* Items per page dropdown */}
          <CustomFilterDropdown
            options={paginationPerPageOptions}
            filterLabel={`${itemsPerPage}`}
            staticValue="per page"
            onCallback={handlePerPageOperation}
          />

          {/* Page range and total items */}
          <div className="flex items-center gap-2 rounded-lg p-2">
            <p className="text-sm font-semibold text-gray-500">
              {(currentPage - 1) * Number(itemsPerPage) + 1}-{Math.min(currentPage * Number(itemsPerPage), totalItems)}
              <span className="font-normal">{` of ${totalItems}`}</span>
            </p>
          </div>
        </div>
      )}

      {/* Navigation buttons */}
      {showPaginationControls && (
        <div className="flex items-center gap-2">
          <PaginationArrowButton
            isDisabled={isFirstPage}
            onButtonClick={() => handlePageChange(currentPage - 1)}
            PaginationArrow={PaginationPreviousArrow}
          />
          <PaginationArrowButton
            isDisabled={isLastPage}
            onButtonClick={() => handlePageChange(currentPage + 1)}
            PaginationArrow={PaginationNextArrow}
          />
        </div>
      )}
    </div>
  );
};

export default TablePagination;
