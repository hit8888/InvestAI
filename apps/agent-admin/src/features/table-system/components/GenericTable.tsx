import { useReactTable, getCoreRowModel, flexRender, type ColumnDef, type SortingState } from '@tanstack/react-table';
import { useMemo, useState, useEffect } from 'react';
import { ChevronDown, ChevronUp, ChevronsUpDown, Info } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ScrollArea, ScrollBar } from '@breakout/design-system/components/shadcn-ui/scroll-area';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@breakout/design-system/components/Tooltip/index';
import type { ColumnDefinition, SortOrder, EntityMetadataColumn } from '../types';
import { createTanStackColumns } from '../utils/columnHelpers.tsx';

interface GenericTableProps<TRow = unknown> {
  data: TRow[];
  columns: ColumnDefinition<TRow>[];
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
      .filter((col): col is ColumnDefinition<TRow> => col !== undefined);
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
    data: data || [], // Ensure data is always an array
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

  // Determine number of columns for shimmer (use actual column count or default to 6)
  const shimmerColumnCount = Math.max(filteredColumns.length, 6);

  // Calculate dynamic number of shimmer rows based on viewport height
  // Table height: calc(100vh - 168px), Header: 42px, Row height: 40px
  // Available height for rows = (100vh - 168px) - 42px = 100vh - 210px
  const [shimmerRowCount, setShimmerRowCount] = useState(() => {
    if (typeof window === 'undefined') return 20; // SSR fallback
    const availableHeight = window.innerHeight - 210; // 168px (container offset) + 42px (header)
    const rowHeight = 40;
    const calculatedRows = Math.floor(availableHeight / rowHeight);
    return Math.max(calculatedRows, 10); // Minimum 10 rows
  });

  useEffect(() => {
    const calculateRows = () => {
      const availableHeight = window.innerHeight - 210; // 168px (container offset) + 42px (header)
      const rowHeight = 40;
      const calculatedRows = Math.ceil(availableHeight / rowHeight);
      setShimmerRowCount(Math.max(calculatedRows, 10)); // Minimum 10 rows
    };

    calculateRows();
    window.addEventListener('resize', calculateRows);
    return () => window.removeEventListener('resize', calculateRows);
  }, []);

  // Shimmer component for loading state
  const ShimmerCell = ({ className = '' }: { className?: string }) => (
    <div className={`h-5 animate-pulse rounded bg-gradient-to-r from-gray-200 to-gray-300 ${className}`} />
  );

  // Render sort icon
  const renderSortIcon = (columnId: string, isSortable: boolean) => {
    if (!isSortable) return null;

    const isCurrentSort = sortBy === columnId;

    if (!isCurrentSort) {
      return <ChevronsUpDown className="ml-1 inline h-4 w-4 text-gray-400" />;
    }

    return sortOrder === 'asc' ? (
      <ChevronUp className="ml-1 inline h-4 w-4 stroke-[2.5] text-gray-800" />
    ) : (
      <ChevronDown className="ml-1 inline h-4 w-4 stroke-[2.5] text-gray-800" />
    );
  };

  // Create a stable key for the table that only changes on manual reset
  // This forces a complete remount to clear any animation/layout state only when needed
  const tableKey = useMemo(() => `table-reset-${resetVersion}`, [resetVersion]);

  return (
    <div className="flex h-[calc(100vh-168px)] w-full max-w-full flex-col overflow-hidden border-b">
      <ScrollArea className="-top-[1px] flex-1">
        <table key={tableKey} className="w-max min-w-full">
          <thead className="sticky top-0 z-20 bg-gray-100">
            {isLoading ? (
              // Loading shimmer header
              <tr>
                {Array.from({ length: shimmerColumnCount }).map((_, colIndex) => {
                  // Vary the width of shimmer cells to look more realistic
                  const widths = ['w-16', 'w-24', 'w-20', 'w-28', 'w-18', 'w-22'];
                  const shimmerWidth = widths[colIndex % widths.length];

                  return (
                    <th
                      key={`shimmer-header-${colIndex}`}
                      className={`h-[42px] whitespace-nowrap border border-gray-200 px-4 text-left text-xs font-[500] tracking-wide text-gray-500 ${colIndex === 0 ? 'border-l-0' : ''}`}
                    >
                      <div className="flex h-full items-center justify-start">
                        <ShimmerCell className={shimmerWidth} />
                      </div>
                    </th>
                  );
                })}
              </tr>
            ) : (
              // Actual headers
              table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  <AnimatePresence mode="popLayout">
                    {headerGroup.headers.map((header, headerIndex) => {
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
                          className={`h-[42px] whitespace-nowrap border border-gray-200 px-4 text-left text-xs font-[500] tracking-wide text-gray-500 ${headerIndex === 0 ? 'border-l-0' : ''}`}
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
                                        <Info className="h-3.5 w-3.5 cursor-default text-gray-400 hover:text-gray-600" />
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
              ))
            )}
          </thead>
          <tbody className="bg-white">
            {isLoading
              ? // Loading shimmer rows - dynamically calculated based on viewport height
                Array.from({ length: shimmerRowCount }).map((_, rowIndex) => (
                  <tr
                    key={`shimmer-row-${rowIndex}`}
                    className="group transition-colors last:border-transparent hover:bg-gray-50"
                  >
                    {Array.from({ length: shimmerColumnCount }).map((_, colIndex) => {
                      // Vary the width of shimmer cells to look more realistic
                      const widths = ['w-full', 'w-3/4', 'w-5/6', 'w-full', 'w-2/3', 'w-4/5'];
                      const shimmerWidth = widths[colIndex % widths.length];

                      return (
                        <td
                          key={`shimmer-cell-${rowIndex}-${colIndex}`}
                          className={`h-[40px] border border-gray-200 px-3 ${colIndex === 0 ? 'border-l-0' : ''} ${rowIndex === 0 ? 'border-t-0' : ''} ${rowIndex === shimmerRowCount - 1 ? 'border-b-0' : ''}`}
                        >
                          <div className="flex h-full items-center justify-start">
                            <ShimmerCell className={shimmerWidth} />
                          </div>
                        </td>
                      );
                    })}
                  </tr>
                ))
              : // Actual data rows
                rows.map((row, rowIndex) => (
                  <tr
                    key={row.id}
                    onClick={() => onRowClick?.(row.original)}
                    className="group cursor-pointer transition-colors last:border-transparent hover:bg-gray-50"
                  >
                    <AnimatePresence mode="popLayout">
                      {row.getVisibleCells().map((cell, cellIndex) => {
                        return (
                          <motion.td
                            key={cell.id}
                            layout
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            transition={{ duration: 0.2, ease: 'easeInOut' }}
                            className={`h-[40px] border border-gray-200 px-3 text-sm text-gray-900 ${cellIndex === 0 ? 'border-l-0' : ''} ${rowIndex === 0 ? 'border-t-0' : ''} ${rowIndex === rows.length - 1 ? 'border-b-0' : ''}`}
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
