import { useReactTable, getCoreRowModel, flexRender, type ColumnDef, type SortingState } from '@tanstack/react-table';
import { useMemo } from 'react';
import { ChevronDown, ChevronUp, ChevronsUpDown, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollArea, ScrollBar } from '@breakout/design-system/components/shadcn-ui/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@breakout/design-system/components/Tooltip/index';
import type { TableColumnDefinition, SortOrder, EntityMetadataColumn } from '../types';
import { createTanStackColumns } from '../utils/columnHelpers.tsx';

interface GenericTableProps<TRow = unknown> {
  data: TRow[];
  columns: TableColumnDefinition<TRow>[];
  metadataColumns: EntityMetadataColumn[]; // Added for smart rendering
  visibleColumns: string[];
  resetVersion: number;
  sortBy: string | null;
  sortOrder: SortOrder | null;
  onSortChange: (field: string | null, order: SortOrder | null) => void;
  onRowClick?: (row: TRow) => void;

  isLoading?: boolean;
  rowKeyColumn?: string;
}

/**
 * Generic table component using TanStack Table
 * Handles sorting, row clicks, and basic rendering
 */
export const GenericTable = <TRow extends Record<string, unknown>>({
  data,
  columns,
  metadataColumns,
  visibleColumns,
  resetVersion,
  sortBy,
  sortOrder,
  onSortChange,
  onRowClick,
  isLoading = false,
}: GenericTableProps<TRow>) => {
  // Filter to visible columns in the order specified by visibleColumns
  const filteredColumns = useMemo(() => {
    const columnMap = new Map(columns.map((col) => [col.id, col]));
    // Map visibleColumns array to actual column objects, preserving order
    return visibleColumns
      .map((id) => columnMap.get(id))
      .filter((col): col is TableColumnDefinition<TRow> => col !== undefined);
  }, [columns, visibleColumns]);

  // Create TanStack Table columns
  const tableColumns = useMemo<ColumnDef<TRow>[]>(() => {
    return createTanStackColumns(filteredColumns, metadataColumns);
  }, [filteredColumns, metadataColumns]);

  // Sorting state (controlled externally)
  const sortingState: SortingState = useMemo(() => {
    if (!sortBy || !sortOrder) return [];
    return [{ id: sortBy, desc: sortOrder === 'desc' }];
  }, [sortBy, sortOrder]);

  // Create table instance
  const table = useReactTable({
    data,
    columns: tableColumns,
    state: {
      sorting: sortingState,
    },
    onSortingChange: (updater) => {
      if (typeof updater === 'function') {
        const newSorting = updater(sortingState);
        if (newSorting.length === 0) {
          onSortChange(null, null);
        } else {
          const sort = newSorting[0];
          onSortChange(sort.id, sort.desc ? 'desc' : 'asc');
        }
      }
    },
    getCoreRowModel: getCoreRowModel(),
    manualSorting: true, // Server-side sorting
    manualPagination: true, // Server-side pagination
    enableSorting: true,
  });

  const rows = table.getRowModel().rows;

  // Render sort icon
  const renderSortIcon = (columnId: string, isSortable: boolean) => {
    if (!isSortable) return null;

    const isCurrentSort = sortBy === columnId;

    if (!isCurrentSort) {
      return <ChevronsUpDown className="ml-1 inline h-4 w-4 text-gray-400" />;
    }

    return sortOrder === 'asc' ? (
      <ChevronUp className="ml-1 inline h-4 w-4 text-blue-600" />
    ) : (
      <ChevronDown className="ml-1 inline h-4 w-4 text-blue-600" />
    );
  };

  // Create a stable key for the table that only changes on manual reset
  // This forces a complete remount to clear any animation/layout state only when needed
  const tableKey = useMemo(() => `table-reset-${resetVersion}`, [resetVersion]);

  return (
    <div className="flex h-[calc(100vh-270px)] w-full max-w-full flex-col overflow-hidden rounded-md border border-b">
      <ScrollArea className="-top-[1px] flex-1">
        <table key={tableKey} className="w-max min-w-full" style={{ borderCollapse: 'collapse' }}>
          <thead className="sticky -top-[1px] z-20 bg-gray-100">
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                <AnimatePresence mode="popLayout">
                  {headerGroup.headers.map((header) => {
                    const isSortable = header.column.getCanSort();
                    const columnDef = filteredColumns.find((col) => col.id === header.column.id);
                    const hasTooltip = columnDef?.tooltipText && columnDef.tooltipText.trim();

                    return (
                      <motion.th
                        key={header.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                        className="whitespace-nowrap border border-gray-200 px-4 py-3 text-left text-xs font-[500] tracking-wide text-gray-500"
                      >
                        {header.isPlaceholder ? null : (
                          <div
                            className={
                              isSortable
                                ? 'flex cursor-pointer select-none items-center justify-between hover:text-gray-700'
                                : 'flex items-center justify-between'
                            }
                            onClick={isSortable ? header.column.getToggleSortingHandler() : undefined}
                          >
                            <div className="flex items-center gap-1.5">
                              <span>{flexRender(header.column.columnDef.header, header.getContext())}</span>
                              {hasTooltip && (
                                <TooltipProvider>
                                  <Tooltip delayDuration={200}>
                                    <TooltipTrigger
                                      asChild
                                      onClick={(e) => {
                                        e.stopPropagation();
                                      }}
                                    >
                                      <Info className="h-3.5 w-3.5 cursor-help text-gray-400 hover:text-gray-600" />
                                    </TooltipTrigger>
                                    <TooltipContent side="top" className="max-w-xs bg-gray-900 text-white">
                                      {columnDef.tooltipText}
                                    </TooltipContent>
                                  </Tooltip>
                                </TooltipProvider>
                              )}
                            </div>
                            {isSortable && renderSortIcon(header.column.id, isSortable)}
                          </div>
                        )}
                      </motion.th>
                    );
                  })}
                </AnimatePresence>
              </tr>
            ))}
          </thead>
          <tbody className="bg-white">
            {rows.map((row) => (
              <tr
                key={row.id}
                onClick={() => onRowClick?.(row.original)}
                className="group cursor-pointer transition-colors last:border-transparent hover:bg-gray-50"
              >
                <AnimatePresence mode="popLayout">
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <motion.td
                        key={cell.id}
                        layout
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: 'easeInOut' }}
                        className="border border-gray-200 px-4 py-3 text-sm text-gray-900"
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </motion.td>
                    );
                  })}
                </AnimatePresence>
              </tr>
            ))}
          </tbody>
        </table>

        {data.length === 0 && !isLoading && <div className="py-12 text-center text-gray-500">No data available</div>}
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
};
