import type { ColumnDef } from '@tanstack/react-table';
import React from 'react';
import {
  EntityMetadataColumn,
  TableColumnDefinition,
  TableColumnDefinitionWithCustomRenderer,
  ColumnDefinition,
} from '../types';
import { smartRenderCell } from '../components/cells/smartRenderCell';

/**
 * Transform entity metadata columns to TanStack Table column definitions
 */
export const transformEntityMetadataToColumns = <TRow = unknown,>(
  metadataColumns: EntityMetadataColumn[],
): TableColumnDefinition<TRow>[] => {
  // Filter columns based on renderability rules:
  // - is_metadata: true => NOT renderable (skip) - should not show in column management
  // - is_meta: true => NOT renderable (skip) - legacy support
  // - data_lookup: null => NOT renderable (skip)
  // Only include columns that have valid data_lookup AND are not metadata columns
  const renderableColumns = metadataColumns
    .filter((col) => {
      const isMetadata = col.is_metadata ?? false;
      const isMeta = col.is_meta ?? false; // Legacy support
      const hasDataLookup = col.data_lookup != null && col.data_lookup !== '';

      // Must have data_lookup AND not be a metadata column (either is_metadata or is_meta)
      return hasDataLookup && !isMetadata && !isMeta;
    })
    .sort((a, b) => a.table_order - b.table_order);

  return renderableColumns.map((col) => {
    // Handle nested fields (e.g., company_demographics.website_url)
    const accessorKey =
      col.parent_column && col.parent_column !== '-' ? `${col.parent_column}.${col.key_name}` : col.key_name;

    // Use data_lookup as column ID for sorting (extract primary lookup if it has fallbacks with ':')
    // Example: "email:details.website_url" -> use "email"
    // Replace dots with double underscores for nested lookups (e.g., "company.name" -> "company__name")
    // Falls back to key_name if data_lookup is not available
    const columnId = col.data_lookup ? col.data_lookup.split(':')[0].trim().replace(/\./g, '__') : col.key_name;

    return {
      id: columnId,
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
        // Store key_name for metadata lookup
        keyName: col.key_name,
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
 * Type guard to check if a column has a custom cell renderer
 */
function hasCustomRenderer<TRow>(col: ColumnDefinition<TRow>): col is TableColumnDefinitionWithCustomRenderer<TRow> {
  return (
    '_customCellRenderer' in col &&
    typeof (col as TableColumnDefinitionWithCustomRenderer<TRow>)._customCellRenderer === 'function'
  );
}

/**
 * Render cell content - handles both custom renderers and smart renderers
 */
function renderCell<TRow>(
  col: ColumnDefinition<TRow>,
  row: TRow,
  rowAsRecord: Record<string, unknown>,
  metadataColumns: EntityMetadataColumn[],
): React.ReactNode {
  // Check for custom cell renderer first (for custom tables like Members)
  if (hasCustomRenderer(col)) {
    const renderer = col._customCellRenderer;
    if (renderer) {
      return renderer(row);
    }
  }

  // Fall back to smart renderer using metadata
  const cellType = col.meta.cellType;

  // Find the original metadata column for this cell
  // Use keyName from meta since col.id now uses data_lookup
  const originalColumn = metadataColumns.find((metaCol) => metaCol.key_name === col.meta.keyName);
  if (!originalColumn) {
    console.warn(`[columnHelpers] Could not find metadata for column: ${col.id}`);
    return <span style={{ color: 'var(--gray-900, #101828)' }}>-</span>;
  }

  return smartRenderCell({
    cellType,
    column: originalColumn,
    row: rowAsRecord,
    allColumns: metadataColumns,
    columnId: col.id,
  });
}

/**
 * Create TanStack Table column definitions from transformed columns
 */
export const createTanStackColumns = <TRow = unknown,>(
  columns: ColumnDefinition<TRow>[],
  metadataColumns: EntityMetadataColumn[],
): ColumnDef<TRow>[] => {
  return columns.map((col) => {
    // For nested fields, use accessor function instead of accessorKey
    const hasNestedPath = col.accessorKey.includes('.');

    // Get default size based on cell type
    // Special handling for actions column - make it narrower (just enough for menu icon button)
    const isActionsColumn = col.id === 'actions';
    const defaultSize = isActionsColumn ? 50 : getDefaultColumnSize(col.meta.cellType);
    const minSize = isActionsColumn ? 50 : 100;
    const maxSize = isActionsColumn ? 60 : 500;

    // Use accessor function for nested fields (e.g., company_demographics.website_url)
    if (hasNestedPath) {
      const path = col.accessorKey.split('.');
      return {
        id: col.id,
        header: col.header,
        enableSorting: col.sortable,
        size: defaultSize,
        minSize: minSize,
        maxSize: maxSize,
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
          const row = info.row.original;
          const rowAsRecord = row as Record<string, unknown>;
          return renderCell(col, row, rowAsRecord, metadataColumns);
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
        minSize: minSize,
        maxSize: maxSize,
        cell: (info) => {
          const row = info.row.original;
          const rowAsRecord = row as Record<string, unknown>;
          return renderCell(col, row, rowAsRecord, metadataColumns);
        },
        meta: col.meta,
      };
    }
  });
};

/**
 * Get the row key column from metadata
 * Returns the data_lookup path (which is how we access the data in the row object)
 * Priority: backend metadata (is_row_key) > configFallback > 'id'
 */
export const getRowKeyColumn = (metadataColumns: EntityMetadataColumn[], configFallback?: string): string => {
  const rowKeyCol = metadataColumns.find((col) => col.is_row_key);

  if (!rowKeyCol) {
    // No row key column found in metadata, use config fallback or default to 'id'
    return configFallback || 'id';
  }

  // Use data_lookup if available (this is the actual path in the row data)
  // Extract primary lookup if it has fallbacks with ':' (e.g., "email:details.website_url" -> "email")
  if (rowKeyCol.data_lookup) {
    return rowKeyCol.data_lookup.split(':')[0].trim();
  }

  // Fallback to key_name if no data_lookup
  return rowKeyCol.key_name ?? configFallback ?? 'id';
};

/**
 * Get PRIMARY columns (always visible - is_display: true)
 */
export const getPrimaryColumns = (columns: TableColumnDefinition[]): string[] => {
  return columns.filter((col) => col.meta.isDisplay === true).map((col) => col.id);
};

/**
 * Get default visible columns
 * Only PRIMARY columns (is_display: true AND is_metadata: false)
 */
export const getDefaultVisibleColumns = (columns: TableColumnDefinition[]): string[] => {
  // Primary columns are already filtered (transformEntityMetadataToColumns filters is_metadata: false)
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
