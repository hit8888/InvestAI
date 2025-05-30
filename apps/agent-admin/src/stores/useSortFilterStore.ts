import { create } from 'zustand';
import { SortFilterState } from '@meaku/core/types/admin/sort';
import { SortByTimestamp } from '../utils/constants';

const InitialSortValues = {
  timestampSort: SortByTimestamp.NEWEST_FIRST,
  sessionLengthSort: null,
  intentScoreSort: null,
};

const commonInitialSortValues = {
  updated_onSort: null,
  statusSort: null,
};

const artifactsInitialSortValues = {
  ...commonInitialSortValues,
  assetSort: null,
  descriptionSort: null,
};

const webpagesInitialSortValues = {
  ...commonInitialSortValues,
  urlSort: null,
  titleSort: null,
};

const documentsInitialSortValues = {
  ...commonInitialSortValues,
  source_nameSort: null,
  data_source_typeSort: null,
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
    set((state) => {
      // Get all keys for the current page
      const pageKeys = Object.keys(state[page]);

      // Create a new object with all values set to null
      const resetValues = pageKeys.reduce(
        (acc, key) => ({
          ...acc,
          [key]: null,
        }),
        {},
      );

      return {
        ...state,
        [page]: {
          ...resetValues,
          [category + 'Sort']: value,
        },
      };
    }),
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
