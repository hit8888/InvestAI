import { create } from 'zustand';
import { SortFilterState } from '@meaku/core/types/admin/sort';
import { SortByTimestamp } from '../utils/constants';

const InitialSortValues = {
  timestampSort: SortByTimestamp.NEWEST_FIRST,
  sessionLengthSort: null,
  intentScoreSort: null,
};

const commonInitialSortValues = {
  updated_onSort: false, // true means desc, false means asc
  statusSort: false,
};

const artifactsInitialSortValues = {
  ...commonInitialSortValues,
  assetSort: false,
  dataSort: false,
};

const webpagesInitialSortValues = {
  ...commonInitialSortValues,
  urlSort: false,
  titleSort: false,
};

const documentsInitialSortValues = {
  ...commonInitialSortValues,
  nameSort: false,
  data_source_typeSort: false,
};

export const useSortFilterStore = create<SortFilterState>((set) => ({
  leads: {
    ...InitialSortValues,
  },
  conversations: {
    ...InitialSortValues,
  },
  webpages: {
    ...webpagesInitialSortValues,
  },
  documents: {
    ...documentsInitialSortValues,
  },
  videos: {
    ...artifactsInitialSortValues,
  },
  slides: {
    ...artifactsInitialSortValues,
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
