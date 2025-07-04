import { create } from 'zustand';
import { AllFilterState, FilterValues, FilterValueTypes, InitialFilterValues } from '@meaku/core/types/admin/filters';
import { PaginationPageType } from '@meaku/core/types/admin/admin';
import { FilterItem } from '@meaku/core/types/admin/api';

export const useAllFilterStore = create<AllFilterState>((set) => ({
  leads: { ...InitialFilterValues },
  'link-clicks': { ...InitialFilterValues },
  conversations: { ...InitialFilterValues },
  webpages: { ...InitialFilterValues },
  documents: { ...InitialFilterValues },
  videos: { ...InitialFilterValues },
  slides: { ...InitialFilterValues },

  setFilter: (page: PaginationPageType, key: keyof FilterValues, value: FilterValueTypes) =>
    set((state) => ({
      ...state,
      [page]: {
        ...state[page],
        [key]: value,
      },
    })),

  resetPageFilters: (page: PaginationPageType) =>
    set((state) => ({
      ...state,
      [page]: { ...InitialFilterValues },
    })),
  initializeFilterValues: (page: PaginationPageType, filters: FilterItem[]) => {
    set((state) => ({
      ...state,
      [page]: { ...InitialFilterValues, presetFilters: filters },
    }));
  },
}));
