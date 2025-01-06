// useFormattedColumns.ts
import { useMemo } from 'react';
import RenderCell from '../components/tableComp/CellValueRenderer';

interface Column {
  id: string /* eslint-disable @typescript-eslint/no-explicit-any */;
  [key: string]: any;
}

export const useFormattedColumns = (columns: Column[]) => {
  return useMemo(() => {
    return columns.map((column) => ({
      ...column,
      cell: (info: any) => <RenderCell id={column?.id} info={info?.getValue()} />,
    }));
  }, [columns]);
};
