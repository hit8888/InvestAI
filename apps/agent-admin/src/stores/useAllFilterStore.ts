import { create } from 'zustand';
import { AllFilterState, DateRangeProp, FilterValues, InitialFilterValues } from '@meaku/core/types/admin/filters';
import { CONVERSATIONS_PAGE_TYPE, LEADS_PAGE_TYPE } from '@meaku/core/types/admin/admin';

export const useAllFilterStore = create<AllFilterState>((set) => ({
  leads: { ...InitialFilterValues },
  conversations: { ...InitialFilterValues },

  setFilter: (
    page: LEADS_PAGE_TYPE | CONVERSATIONS_PAGE_TYPE,
    key: keyof FilterValues,
    value: DateRangeProp | string | string[] | undefined,
  ) =>
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
}));
