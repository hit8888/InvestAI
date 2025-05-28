// useFormattedColumns.ts
import { useMemo } from 'react';
import RenderCell from '../components/tableComp/CellValueRenderer';
import { CellProps } from '@meaku/core/types/admin/admin-table';

interface Column {
  id: string;
  accessorKey?: string;
  accessorFn?: (row: unknown) => unknown;
  header?: string | Record<string, string>;
}

export const useFormattedColumns = (columns: Column[]) => {
  return useMemo(() => {
    return columns.map((column) => ({
      ...column,
      cell: (info: CellProps) => {
        // Use accessorFn if available, otherwise use getValue
        const value = column.accessorFn ? column.accessorFn(info.row.original) : info.getValue();
        return <RenderCell id={column?.id} info={value} />;
      },
    }));
  }, [columns]);
};
