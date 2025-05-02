import { create } from 'zustand';
import { AllFilterState, FilterValues, FilterValueTypes, InitialFilterValues } from '@meaku/core/types/admin/filters';
import { CONVERSATIONS_PAGE_TYPE, LEADS_PAGE_TYPE } from '@meaku/core/types/admin/admin';
import { FilterItem } from '@meaku/core/types/admin/api';

export const useAllFilterStore = create<AllFilterState>((set) => ({
  leads: { ...InitialFilterValues },
  conversations: { ...InitialFilterValues },

  setFilter: (page: LEADS_PAGE_TYPE | CONVERSATIONS_PAGE_TYPE, key: keyof FilterValues, value: FilterValueTypes) =>
    set((state) => ({
      ...state,
      [page]: {
        ...state[page],
        [key]: value,
      },
    })),

  resetPageFilters: (page: LEADS_PAGE_TYPE | CONVERSATIONS_PAGE_TYPE) =>
    set((state) => ({
      ...state,
      [page]: { ...InitialFilterValues },
    })),
  initializeFilterValues: (page: LEADS_PAGE_TYPE | CONVERSATIONS_PAGE_TYPE, filters: FilterItem[]) => {
    set((state) => ({
      ...state,
      [page]: { ...InitialFilterValues, presetFilters: filters },
    }));
  },
}));
