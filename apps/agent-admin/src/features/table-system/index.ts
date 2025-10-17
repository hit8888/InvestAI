/**
 * Generic Table System
 *
 * A reusable, URL-driven table system for building data tables with:
 * - Filtering, sorting, pagination
 * - Column management
 * - Row details drawer
 * - Loading, empty, and error states
 *
 * Usage:
 * ```tsx
 * import { GenericTablePage } from '@/features/table-system';
 * import { myTableConfig } from './config';
 *
 * const MyTablePage = () => <GenericTablePage config={myTableConfig} />;
 * ```
 */

// Main component
export { GenericTablePage } from './components/GenericTablePage';

// Core hooks (for advanced usage)
export { useGenericTableState } from './hooks/useGenericTableState';
export { useTableUrlState } from './hooks/useTableUrlState';
export { useColumnPreferences } from './hooks/useColumnPreferences';
export { useFilterOptions } from './hooks/useFilterOptions';

// Types
export type {
  TablePageConfig,
  DrawerContentProps,
  FilterConfig,
  FilterOption,
  FilterValues,
  DateRangeValue,
  FilterType,
  EntityMetadataColumn,
  EntityMetadataResponse,
  TableColumnDefinition,
  ColumnType,
  CellType,
  TableResponse,
  TableRequestPayload,
  SortState,
  SortOrder,
} from './types';

// Utilities (for advanced usage)
export { validateTableConfig } from './utils/configValidator';
export { parseUrlParams, serializeToUrlParams } from './utils/urlStateHelpers';
export {
  transformEntityMetadataToColumns,
  createTanStackColumns,
  getRowKeyColumn,
  getPrimaryColumns,
  getDefaultVisibleColumns,
} from './utils/columnHelpers.tsx';

// Components (for custom implementations)
export { GenericTableContainer } from './components/GenericTableContainer';
export { GenericTable } from './components/GenericTable';
export { GenericTableHeader } from './components/GenericTableHeader';
export { GenericTableFilters } from './components/GenericTableFilters';
export { GenericTableColumnManager } from './components/GenericTableColumnManager';
export { GenericTablePagination } from './components/GenericTablePagination';
export { GenericRowDrawer } from './components/GenericRowDrawer';

// Filter components
export { SearchFilter } from './components/filters/SearchFilter';
export { MultiSelectFilter } from './components/filters/MultiSelectFilter';
export { DateRangeFilter } from './components/filters/DateRangeFilter';
export { DynamicFilter } from './components/filters/DynamicFilter';
export { FilterChipsList } from './components/filters/FilterChipsList';

// State components
export { TableLoadingSkeleton } from './components/states/TableLoadingSkeleton';
export { TableEmptyState } from './components/states/TableEmptyState';
export { TableErrorState } from './components/states/TableErrorState';
export { ConfigErrorScreen } from './components/states/ConfigErrorScreen';
export { TableLoadingOverlay } from './components/states/TableLoadingOverlay';
