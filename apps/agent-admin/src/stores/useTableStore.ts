import { create } from 'zustand';
import TableDataManager from '../managers/TableDataManager';
import { TableDataResponse } from '@meaku/core/types/admin/admin';

interface TableStore {
  // Raw API data (if needed)
  data: TableDataResponse | null;
  // TableDataManager instance built from the API data
  tableManager: TableDataManager | null;
  // Error state
  error: string | null;
  // Actions to update the store
  setTableData: (data: TableDataResponse) => void;
  clearError: () => void;
}

export const useTableStore = create<TableStore>((set) => ({
  data: null,
  tableManager: null,
  error: null,
  setTableData: (data) => {
    const manager = new TableDataManager(data);
    set({
      data,
      tableManager: manager,
      error: manager.hasError() ? manager.getError() : null,
    });
  },
  clearError: () => set({ error: null }),
}));
