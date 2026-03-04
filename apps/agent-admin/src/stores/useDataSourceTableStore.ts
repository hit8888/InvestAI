import { create } from 'zustand';
import { CommonDataSourceResponse, TableDataResponse } from '@neuraltrade/core/types/admin/admin';
import { PaginationDataSchema } from '@neuraltrade/core/types/admin/api';
import TableDataManager from '../managers/TableDataManager';

interface DataSourceTableState {
  results: CommonDataSourceResponse[];
  current_page: number;
  page_size: number;
  total_pages: number;
  total_records: number;
  selectedIds: number[];
  tableManager: TableDataManager | null;
  error: string | null;
  setTableData: (data: TableDataResponse | null) => void;
  toggleSelectId: (id: number) => void;
  selectAll: () => void;
  deselectAll: () => void;
  isIdSelected: (id: number) => boolean;
  getSelectedIds: () => number[];
  getSelectedDataSources: () => CommonDataSourceResponse[];
  updateSingleDataSource: (id: number, data: Partial<CommonDataSourceResponse>) => void;
  getPaginatedTableData: () => {
    current_page: number;
    page_size: number;
    total_pages: number;
    total_records: number;
  };
}

export const useDataSourceTableStore = create<DataSourceTableState>((set, get) => ({
  results: [],
  current_page: 1,
  page_size: 10,
  total_pages: 1,
  total_records: 0,
  selectedIds: [],
  tableManager: null,
  error: null,

  setTableData: (data) => {
    if (data) {
      const manager = new TableDataManager(data);
      if (manager.hasError()) {
        set({ error: manager.getError() });
        return;
      }
      const paginationData = manager.getPaginatedTableData();
      if (!paginationData) {
        set({ error: 'Failed to get pagination data' });
        return;
      }
      set({
        results: manager.getTableDataResults() as CommonDataSourceResponse[],
        current_page: paginationData.current_page,
        page_size: paginationData.page_size,
        total_pages: paginationData.total_pages,
        total_records: paginationData.total_records,
        tableManager: manager,
        error: null,
      });
    } else {
      set({
        results: [],
        current_page: 1,
        page_size: 10,
        total_pages: 1,
        total_records: 0,
        selectedIds: [],
        tableManager: null,
        error: null,
      });
    }
  },

  toggleSelectId: (id) => {
    set((state) => ({
      selectedIds: state.selectedIds.includes(id)
        ? state.selectedIds.filter((selectedId) => selectedId !== id)
        : [...state.selectedIds, id],
    }));
  },

  selectAll: () => {
    set((state) => ({
      selectedIds: state.results.map((source) => source.id),
    }));
  },

  deselectAll: () => {
    set({ selectedIds: [] });
  },

  isIdSelected: (id) => {
    return get().selectedIds.includes(id);
  },

  getSelectedIds: () => {
    return get().selectedIds;
  },

  getSelectedDataSources: () => {
    const state = get();
    return state.results.filter((source) => state.selectedIds.includes(source.id));
  },

  getPaginatedTableData: () => {
    const state = get();
    const paginationData = {
      current_page: state.current_page,
      page_size: state.page_size,
      total_pages: state.total_pages,
      total_records: state.total_records,
    };
    return PaginationDataSchema.parse(paginationData);
  },

  updateSingleDataSource: (id: number, data: Partial<CommonDataSourceResponse>) => {
    set((state) => {
      const updatedResults = state.results.map((source) =>
        source.id === id ? ({ ...source, ...data } as CommonDataSourceResponse) : source,
      );
      return { results: updatedResults };
    });
  },
}));

// Custom hooks for optimized selection
export const useTableSelection = () => {
  const toggleSelectId = useDataSourceTableStore((state) => state.toggleSelectId);
  const selectAll = useDataSourceTableStore((state) => state.selectAll);
  const deselectAll = useDataSourceTableStore((state) => state.deselectAll);
  const getSelectedIds = useDataSourceTableStore((state) => state.getSelectedIds);
  const isIdSelected = useDataSourceTableStore((state) => state.isIdSelected);
  const getSelectedDataSources = useDataSourceTableStore((state) => state.getSelectedDataSources);

  return {
    toggleSelectId,
    selectAll,
    deselectAll,
    getSelectedIds,
    isIdSelected,
    getSelectedDataSources,
  };
};
