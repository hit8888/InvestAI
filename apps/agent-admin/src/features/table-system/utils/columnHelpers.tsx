import type { ColumnDef } from '@tanstack/react-table';
import { EntityMetadataColumn, TableColumnDefinition } from '../types';
import { smartRenderCell } from '../components/cells/smartRenderCell';

/**
 * Transform entity metadata columns to TanStack Table column definitions
 */
export const transformEntityMetadataToColumns = <TRow = unknown,>(
  metadataColumns: EntityMetadataColumn[],
): TableColumnDefinition<TRow>[] => {
  // Filter columns based on renderability rules:
  // - is_meta: true => NOT renderable (skip)
  // - data_lookup: null => NOT renderable (skip)
  // Only include columns that have valid data_lookup AND are not meta columns
  const renderableColumns = metadataColumns
    .filter((col) => {
      const isMeta = col.is_meta ?? false;
      const hasDataLookup = col.data_lookup != null && col.data_lookup !== '';

      // Must have data_lookup AND not be a meta column
      return hasDataLookup && !isMeta;
    })
    .sort((a, b) => a.table_order - b.table_order);

  return renderableColumns.map((col) => {
    // Handle nested fields (e.g., company_demographics.website_url)
    const accessorKey =
      col.parent_column && col.parent_column !== '-' ? `${col.parent_column}.${col.key_name}` : col.key_name;

    return {
      id: col.key_name,
      accessorKey,
      header: col.display_name,
      sortable: col.is_sortable ?? true, // Default to true for V1 compatibility
      tooltipText: col.tooltip_text || undefined,
      meta: {
        cellType: col.cell_type ?? 'TEXT', // Default to TEXT
        dataType: col.data_type,
        description: col.description,
        isRowKey: col.is_row_key ?? false,
        isDisplay: col.is_display,
      },
    };
  });
};

/**
 * Get default column size based on cell type
 */
const getDefaultColumnSize = (cellType: string): number => {
  switch (cellType) {
    case 'COMPANY':
      return 250;
    case 'LOCATION_WITH_FLAG':
      return 200;
    case 'SDR_ASSIGNMENT':
      return 180;
    case 'TIME':
      return 150;
    case 'CATEGORY_LMH':
      return 130;
    case 'BOOLEAN':
      return 120;
    default:
      return 180; // Default width
  }
};

/**
 * Create TanStack Table column definitions from transformed columns
 */
export const createTanStackColumns = <TRow = unknown,>(
  columns: TableColumnDefinition<TRow>[],
  metadataColumns: EntityMetadataColumn[],
): ColumnDef<TRow>[] => {
  return columns.map((col) => {
    // For nested fields, use accessor function instead of accessorKey
    const hasNestedPath = col.accessorKey.includes('.');

    // Get default size based on cell type
    const defaultSize = getDefaultColumnSize(col.meta.cellType);

    // Use accessor function for nested fields (e.g., company_demographics.website_url)
    if (hasNestedPath) {
      const path = col.accessorKey.split('.');
      return {
        id: col.id,
        header: col.header,
        enableSorting: col.sortable,
        size: defaultSize,
        minSize: 100,
        maxSize: 500,
        accessorFn: (row: TRow) => {
          let value: unknown = row;
          for (const key of path) {
            if (value && typeof value === 'object') {
              value = (value as Record<string, unknown>)[key];
            } else {
              return null;
            }
          }
          return value;
        },
        cell: (info) => {
          const row = info.row.original as Record<string, unknown>;
          const cellType = col.meta.cellType;

          // Find the original metadata column for this cell
          const originalColumn = metadataColumns.find((metaCol) => metaCol.key_name === col.id);
          if (!originalColumn) {
            console.warn(`[columnHelpers] Could not find metadata for column: ${col.id}`);
            return <span className="text-gray-400">-</span>;
          }

          return smartRenderCell({
            cellType,
            column: originalColumn,
            row,
            allColumns: metadataColumns,
            columnId: col.id,
          });
        },
        meta: col.meta,
      };
    } else {
      return {
        id: col.id,
        accessorKey: col.accessorKey,
        header: col.header,
        enableSorting: col.sortable,
        size: defaultSize,
        minSize: 100,
        maxSize: 500,
        cell: (info) => {
          const row = info.row.original as Record<string, unknown>;
          const cellType = col.meta.cellType;

          // Find the original metadata column for this cell
          const originalColumn = metadataColumns.find((metaCol) => metaCol.key_name === col.id);
          if (!originalColumn) {
            console.warn(`[columnHelpers] Could not find metadata for column: ${col.id}`);
            return <span className="text-gray-400">-</span>;
          }

          return smartRenderCell({
            cellType,
            column: originalColumn,
            row,
            allColumns: metadataColumns,
            columnId: col.id,
          });
        },
        meta: col.meta,
      };
    }
  });
};

/**
 * Get the row key column from metadata
 */
export const getRowKeyColumn = (metadataColumns: EntityMetadataColumn[]): string => {
  const rowKeyCol = metadataColumns.find((col) => col.is_row_key);
  return rowKeyCol?.key_name ?? 'id'; // Fallback to 'id'
};

/**
 * Get PRIMARY columns (always visible - is_display: true)
 */
export const getPrimaryColumns = (columns: TableColumnDefinition[]): string[] => {
  return columns.filter((col) => col.meta.isDisplay === true).map((col) => col.id);
};

/**
 * Get default visible columns
 * Only PRIMARY columns (is_display: true AND is_meta: false)
 */
export const getDefaultVisibleColumns = (columns: TableColumnDefinition[]): string[] => {
  // Primary columns are already filtered (transformEntityMetadataToColumns filters is_meta: false)
  // So we just need to filter by isDisplay
  return columns.filter((col) => col.meta.isDisplay === true).map((col) => col.id);
};

/**
 * Filter columns by visibility preference
 */
export const filterVisibleColumns = <TRow = unknown,>(
  columns: TableColumnDefinition<TRow>[],
  visibleColumnIds: string[],
): TableColumnDefinition<TRow>[] => {
  const visibleSet = new Set(visibleColumnIds);
  return columns.filter((col) => visibleSet.has(col.id));
};
