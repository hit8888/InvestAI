import { create } from 'zustand';
import TableDataManager from '../managers/TableDataManager';
import { TableDataResponse } from '@meaku/core/types/admin/admin';

interface TableStore {
  // Raw API data (if needed)
  data: TableDataResponse | null;
  // TableDataManager instance built from the API data
  tableManager: TableDataManager | null;
  // Actions to update the store
  setTableData: (data: TableDataResponse) => void;
}

export const useTableStore = create<TableStore>((set) => ({
  data: null,
  tableManager: null,
  setTableData: (data) =>
    set({
      data,
      tableManager: new TableDataManager(data),
    }),
}));
