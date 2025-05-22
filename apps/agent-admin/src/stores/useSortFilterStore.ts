import { create } from 'zustand';
import { SortFilterState } from '@meaku/core/types/admin/sort';
import { SortByTimestamp } from '../utils/constants';

const InitialSortValues = {
  timestampSort: SortByTimestamp.NEWEST_FIRST,
  sessionLengthSort: null,
  intentScoreSort: null,
};

export const useSortFilterStore = create<SortFilterState>((set) => ({
  leads: {
    ...InitialSortValues,
  },
  conversations: {
    ...InitialSortValues,
  },
  webpages: {
    ...InitialSortValues,
  },
  documents: {
    ...InitialSortValues,
  },
  videos: {
    ...InitialSortValues,
  },
  setSortValue: (page, category, value) =>
    set((state) => ({
      ...state,
      [page]: {
        ...state[page],
        [category + 'Sort']: value,
      },
    })),
  resetPageSorts: (page) =>
    set((state) => ({
      ...state,
      [page]: { ...InitialSortValues },
    })),
  initializeSortValues: (page, sortValues) =>
    set((state) => ({
      ...state,
      [page]: { ...sortValues },
    })),
}));
