import React from 'react';
import CustomFilterDropdown from './CustomFilterDropdown';
import PaginationNextArrow from '@breakout/design-system/components/icons/pagination-next-arrow';
import PaginationPreviousArrow from '@breakout/design-system/components/icons/pagination-previous-arrow';
import NavigationArrowButton from './NavigationArrowButton';
import { PAGINATION_PER_PAGE_OPTIONS } from '../../utils/constants';

interface PaginationProps {
  totalItems: number; // Total number of items
  totalPages: number; // Total number of pages
  itemsPerPage: number; // Items per page
  currentPage: number; // Current page
  handlePageChange: (page: number) => void; // Callback function to handle page changes
  onItemsPerPageChange: (page: number) => void; // Callback function to handle ItemsPerPage changes
}

const TablePagination: React.FC<PaginationProps> = ({
  totalItems,
  totalPages,
  itemsPerPage,
  onItemsPerPageChange,
  handlePageChange,
  currentPage,
}) => {
  const handlePerPageOperation = (selectedOption: string | null) => {
    onItemsPerPageChange(Number(selectedOption));
  };

  const isFirstPage = currentPage === 1;
  const isLastPage = totalPages === 0 || currentPage === totalPages;

  return (
    <div className="flex items-center justify-end gap-4">
      <div className="flex items-start gap-2">
        {/* Items per page dropdown */}
        <CustomFilterDropdown
          options={PAGINATION_PER_PAGE_OPTIONS}
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

      {/* Navigation buttons */}
      <div className="flex items-center gap-2">
        <NavigationArrowButton
          conditionOnBtn={isFirstPage}
          onButtonClick={() => handlePageChange(currentPage - 1)}
          PaginationArrow={PaginationPreviousArrow}
        />
        <NavigationArrowButton
          conditionOnBtn={isLastPage}
          onButtonClick={() => handlePageChange(currentPage + 1)}
          PaginationArrow={PaginationNextArrow}
        />
      </div>
    </div>
  );
};

export default TablePagination;
