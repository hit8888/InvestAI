import { useState, useEffect } from 'react';

interface UsePaginationProps<T> {
  data: T[]; // Original data to paginate
  initialItemsPerPage?: number; // Default items per page
}

interface UsePaginationResult<T> {
  paginatedData: T[]; // Data for the current page
  currentPage: number; // Current page
  totalPages: number; // Total number of pages
  itemsPerPage: number; // Current items per page value
  handlePageChange: (page: number) => void; // Function to change page
  handleItemsPerPageChange: (value: number) => void; // Function to change items per page
}

export const usePagination = <T>({ data, initialItemsPerPage = 50 }: UsePaginationProps<T>): UsePaginationResult<T> => {
  const [itemsPerPage, setItemsPerPage] = useState<number>(initialItemsPerPage);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [paginatedData, setPaginatedData] = useState<T[]>([]);

  const totalItems = data.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleItemsPerPageChange = (value: number) => {
    setItemsPerPage(value);
    setCurrentPage(1);
  };

  useEffect(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = startIndex + itemsPerPage;
    setPaginatedData(data.slice(startIndex, endIndex));
  }, [data, currentPage, itemsPerPage]);

  return {
    paginatedData,
    currentPage,
    totalPages,
    itemsPerPage,
    handlePageChange,
    handleItemsPerPageChange,
  };
};
