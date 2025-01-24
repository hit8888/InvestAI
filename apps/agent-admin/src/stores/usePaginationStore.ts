import { CONVERSATIONS_PAGE_TYPE, LEADS_PAGE_TYPE } from '@meaku/core/types/admin/admin';
import { create } from 'zustand';

interface PaginationValues {
  currentPage: number;
  itemsPerPage: number;
}

export interface PaginationStateAndActions {
  leads: PaginationValues;
  conversations: PaginationValues;
  setPaginationValue: (
    page: LEADS_PAGE_TYPE | CONVERSATIONS_PAGE_TYPE,
    key: keyof PaginationValues,
    value: number,
  ) => void;
  resetPaginationValue: (page: LEADS_PAGE_TYPE | CONVERSATIONS_PAGE_TYPE) => void;
}

const DEFAULT_ITEMS_PER_PAGE = 50;

export const InitialPaginationValues = {
  currentPage: 1,
  itemsPerPage: DEFAULT_ITEMS_PER_PAGE,
};

export const usePaginationStore = create<PaginationStateAndActions>((set) => ({
  leads: { ...InitialPaginationValues },
  conversations: { ...InitialPaginationValues },

  setPaginationValue(page, key, value) {
    set((state) => ({
      ...state,
      [page]: {
        ...state[page],
        [key]: value,
        ...(key === 'itemsPerPage' ? { currentPage: 1 } : {}), // Reset currentPage when itemsPerPage changes
      },
    }));
  },

  resetPaginationValue: (page: LEADS_PAGE_TYPE | CONVERSATIONS_PAGE_TYPE) =>
    set((state) => ({
      ...state,
      [page]: { ...InitialPaginationValues },
    })),
}));
