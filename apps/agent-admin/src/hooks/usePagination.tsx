import { useCallback } from 'react';
import { usePaginationStore } from '../stores/usePaginationStore';
import { PaginationPageType } from '@neuraltrade/core/types/admin/admin';

interface UsePaginationProps {
  pageType: PaginationPageType;
}

interface UsePaginationResult {
  currentPage: number; // Current page
  itemsPerPage: number; // Current items per page value
  handlePageChange: (page: number) => void; // Function to change page
  handleItemsPerPageChange: (value: number) => void; // Function to change items per page
}

export const usePagination = ({ pageType }: UsePaginationProps): UsePaginationResult => {
  const paginationState = usePaginationStore();
  const { currentPage, itemsPerPage } = paginationState[pageType];

  const handlePageChange = useCallback(
    (page: number) => {
      paginationState.setPaginationValue(pageType, 'currentPage', page);
    },
    [paginationState],
  );

  const handleItemsPerPageChange = useCallback(
    (pageSize: number) => {
      paginationState.setPaginationValue(pageType, 'itemsPerPage', pageSize);
    },
    [paginationState],
  );

  return {
    currentPage,
    itemsPerPage,
    handlePageChange,
    handleItemsPerPageChange,
  };
};
