import { PaginationPageType } from '@meaku/core/types/admin/admin';
import {
  CONVERSATIONS_PAGE,
  DOCUMENTS_PAGE,
  LEADS_PAGE,
  SLIDES_PAGE,
  VIDEOS_PAGE,
  WEBPAGES_PAGE,
} from '@meaku/core/utils/index';
import { create } from 'zustand';

interface PaginationValues {
  currentPage: number;
  itemsPerPage: number;
}

export interface PaginationStateAndActions {
  leads: PaginationValues;
  conversations: PaginationValues;
  webpages: PaginationValues;
  documents: PaginationValues;
  videos: PaginationValues;
  slides: PaginationValues;
  setPaginationValue: (page: PaginationPageType, key: keyof PaginationValues, value: number) => void;
  resetPaginationValue: (page: PaginationPageType) => void;
}

const DEFAULT_ITEMS_PER_PAGE = 50;

export const InitialPaginationValues = {
  currentPage: 1,
  itemsPerPage: DEFAULT_ITEMS_PER_PAGE,
};

const pageTypes: PaginationPageType[] = [
  LEADS_PAGE,
  CONVERSATIONS_PAGE,
  WEBPAGES_PAGE,
  DOCUMENTS_PAGE,
  VIDEOS_PAGE,
  SLIDES_PAGE,
];

const initialPaginationState = pageTypes.reduce(
  (acc, pageType) => {
    acc[pageType] = { ...InitialPaginationValues };
    return acc;
  },
  {} as Record<PaginationPageType, PaginationValues>,
);

export const usePaginationStore = create<PaginationStateAndActions>((set) => ({
  ...initialPaginationState,

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

  resetPaginationValue: (page: PaginationPageType) =>
    set((state) => ({
      ...state,
      [page]: { ...InitialPaginationValues },
    })),
}));
