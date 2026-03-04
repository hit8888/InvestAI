import { create } from 'zustand';
import { SortFilterState } from '@neuraltrade/core/types/admin/sort';
import { INITIAL_SORT_VALUES } from '../utils/constants';

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
  page_typeSort: null,
};

const documentsInitialSortValues = {
  ...commonInitialSortValues,
  source_nameSort: null,
  data_source_typeSort: null,
  descriptionSort: null,
  access_typeSort: null,
};

export const useSortFilterStore = create<SortFilterState>((set) => ({
  leads: {
    ...INITIAL_SORT_VALUES,
  },
  'link-clicks': {
    ...INITIAL_SORT_VALUES,
  },
  conversations: {
    ...INITIAL_SORT_VALUES,
  },
  prospects: {
    ...INITIAL_SORT_VALUES,
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
      [page]: { ...INITIAL_SORT_VALUES },
    })),
  initializeSortValues: (page, sortValues) =>
    set((state) => ({
      ...state,
      [page]: { ...sortValues },
    })),
}));
