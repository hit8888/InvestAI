import React, { useState } from 'react';
import CustomFilterDropdown from './CustomFilterDropdown';
import PaginationNextArrow from '@breakout/design-system/components/icons/pagination-next-arrow';
import PaginationPreviousArrow from '@breakout/design-system/components/icons/pagination-previous-arrow';
import NavigationArrowButton from './NavigationArrowButton';

interface PaginationProps {
  totalItems: number; // Total number of items
  itemsPerPage: number; // Items per page
  onPageChange: (page: number) => void; // Callback function to handle page changes
}

const TablePagination: React.FC<PaginationProps> = ({ totalItems, itemsPerPage, onPageChange }) => {
  const [itemsPerPageValue, setItemsPerPageValue] = useState<string | null>(`${itemsPerPage}`);
  const [currentPage, setCurrentPage] = useState<number>(1); // Current page state
  const totalPages = Math.ceil(totalItems / Number(itemsPerPageValue)); // Total number of pages

  const handlePerPageOperation = (selectedOption: string | null) => {
    if (selectedOption) {
      //   console.log('Selected Option:', selectedOption);
      setItemsPerPageValue(selectedOption);
    } else {
      //   console.log('No option selected');
      setItemsPerPageValue(`${itemsPerPage}`);
    }
    setCurrentPage(1);
  };

  const handleCurrentPage = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      onPageChange(page);
    }
  };

  const PerPageOptions = ['10', '20', '50'];
  const isFirstPage = currentPage === 1;
  const isLastPage = currentPage === totalPages;

  return (
    <div className="flex items-center justify-end gap-4">
      <div className="flex items-start gap-2">
        {/* Items per page dropdown */}
        <CustomFilterDropdown
          options={PerPageOptions}
          filterLabel={`${itemsPerPageValue}`}
          staticValue="per page"
          onCallback={handlePerPageOperation}
        />

        {/* Page range and total items */}
        <div className="flex items-center gap-2 rounded-lg border border-[#DCDAF8] bg-[#FBFBFE] p-2">
          <p className="text-sm font-semibold text-[#667085]">
            {(currentPage - 1) * Number(itemsPerPageValue) + 1}-
            {Math.min(currentPage * Number(itemsPerPageValue), totalItems)}
            <span className="font-normal">{` of ${totalItems}`}</span>
          </p>
        </div>
      </div>

      {/* Navigation buttons */}
      <div className="flex items-center gap-2">
        <NavigationArrowButton
          conditionOnBtn={isFirstPage}
          onButtonClick={() => handleCurrentPage(currentPage - 1)}
          PaginationArrow={PaginationPreviousArrow}
        />
        <NavigationArrowButton
          conditionOnBtn={isLastPage}
          onButtonClick={() => handleCurrentPage(currentPage + 1)}
          PaginationArrow={PaginationNextArrow}
        />
      </div>
    </div>
  );
};

export default TablePagination;
