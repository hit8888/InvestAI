import { createContext, useContext, useCallback, useMemo } from 'react';
import type { TableColumnDefinition } from '../types';

interface ColumnManagementContextValue {
  columns: TableColumnDefinition[];
  visibleColumns: string[];
  setColumnVisibility: (columnId: string, visible: boolean) => void;
  setColumnOrder: (columnIds: string[]) => void;
  toggleColumnVisibility: (columnId: string) => void;
  resetColumnVisibility: () => void;
}

const ColumnManagementContext = createContext<ColumnManagementContextValue | null>(null);

// eslint-disable-next-line react-refresh/only-export-components
export const useColumnManagement = () => {
  const context = useContext(ColumnManagementContext);
  if (!context) {
    throw new Error('useColumnManagement must be used within ColumnManagementProvider');
  }
  return context;
};

interface ColumnManagementProviderProps {
  columns: TableColumnDefinition[];
  visibleColumns: string[];
  setColumnVisibility: (columnId: string, visible: boolean) => void;
  setColumnOrder: (columnIds: string[]) => void;
  toggleColumnVisibility: (columnId: string) => void;
  resetColumnVisibility: () => void;
  children: React.ReactNode;
}

export const ColumnManagementProvider = ({
  columns,
  visibleColumns,
  setColumnVisibility,
  setColumnOrder,
  toggleColumnVisibility,
  resetColumnVisibility,
  children,
}: ColumnManagementProviderProps) => {
  // Memoize callbacks to prevent unnecessary re-renders
  const stableSetColumnVisibility = useCallback(
    (columnId: string, visible: boolean) => {
      setColumnVisibility(columnId, visible);
    },
    [setColumnVisibility],
  );

  const stableSetColumnOrder = useCallback(
    (columnIds: string[]) => {
      setColumnOrder(columnIds);
    },
    [setColumnOrder],
  );

  const value = useMemo<ColumnManagementContextValue>(
    () => ({
      columns,
      visibleColumns,
      setColumnVisibility: stableSetColumnVisibility,
      setColumnOrder: stableSetColumnOrder,
      toggleColumnVisibility,
      resetColumnVisibility,
    }),
    [
      columns,
      visibleColumns,
      stableSetColumnVisibility,
      stableSetColumnOrder,
      toggleColumnVisibility,
      resetColumnVisibility,
    ],
  );

  return <ColumnManagementContext.Provider value={value}>{children}</ColumnManagementContext.Provider>;
};
