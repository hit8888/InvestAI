import { useState } from 'react';

interface UsePaginationProps {
  initialItemsPerPage?: number; // Default items per page
}

interface UsePaginationResult {
  currentPage: number; // Current page
  itemsPerPage: number; // Current items per page value
  handlePageChange: (page: number) => void; // Function to change page
  handleItemsPerPageChange: (value: number) => void; // Function to change items per page
}

export const usePagination = ({ initialItemsPerPage = 50 }: UsePaginationProps): UsePaginationResult => {
  const [itemsPerPage, setItemsPerPage] = useState<number>(initialItemsPerPage);
  const [currentPage, setCurrentPage] = useState<number>(1);

  const handlePageChange = (page: number) => {
    if (page >= 1) {
      setCurrentPage(page);
    }
  };

  const handleItemsPerPageChange = (value: number) => {
    if (value > 0) {
      setItemsPerPage(value);
      setCurrentPage(1); // Reset page
    }
  };

  return {
    currentPage,
    itemsPerPage,
    handlePageChange,
    handleItemsPerPageChange,
  };
};
