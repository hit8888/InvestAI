import { DataSourceItem } from '@neuraltrade/core/types/admin/api';
import { create } from 'zustand';

// Type guard to check if an item is a DataSourceItem
const isDataSourceItem = (item: DataSourceItem): item is DataSourceItem => {
  return 'id' in item && 'key' in item && 'public_url' in item;
};

interface DataSourcesState {
  dataSources: DataSourceItem[];
  isLoading: boolean;
  error: string | null;

  // Actions
  addDataSource: (source: DataSourceItem) => void;
  addMultipleDataSources: (sources: DataSourceItem[]) => void;
  removeDataSource: (id: string) => void;
  removeAllDataSources: () => void;
  updateDataSource: (id: string, updates: Partial<DataSourceItem>) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
}

export const useDataSourcesStore = create<DataSourcesState>((set) => ({
  dataSources: [],
  isLoading: false,
  error: null,

  addDataSource: (source) =>
    set((state) => ({
      dataSources: [...state.dataSources, source],
    })),

  addMultipleDataSources: (sources) =>
    set((state) => ({
      dataSources: [...state.dataSources, ...sources],
    })),

  removeDataSource: (id) =>
    set((state) => {
      const dataSource = state.dataSources.find((source) => source.id === id);
      if (dataSource?.type === 'webpage') {
        return {
          dataSources: state.dataSources.map((source) =>
            source.id === id ? { ...source, is_cancelled: true } : source,
          ),
        };
      }
      return {
        dataSources: state.dataSources.filter((source) => source.id !== id),
      };
    }),

  removeAllDataSources: () =>
    set(() => ({
      dataSources: [],
    })),

  updateDataSource: (id, updates) =>
    set((state) => ({
      dataSources: state.dataSources.map((source) =>
        isDataSourceItem(source) && source.id === id ? { ...source, ...updates } : source,
      ),
    })),

  setLoading: (loading) =>
    set(() => ({
      isLoading: loading,
    })),

  setError: (error) =>
    set(() => ({
      error,
    })),
}));
