import { FilterConfig, QuickFilterConfig } from './filter.types';

/**
 * Drawer content component props
 */
export interface DrawerContentProps<TRow = unknown> {
  data: TRow;
  onClose: () => void;
  refreshTable: () => void;
  isTableLoading?: boolean; // Optional - indicates if the table is still loading initial data
}

/**
 * Configuration for a table page
 * Generic and reusable across all table implementations
 */

export interface TablePageConfig<TRow = unknown> {
  /** Unique identifier for this table page */
  pageKey: string;

  /** Display title for the page */
  pageTitle: string;

  /**
   * Field name to use as the unique row identifier
   * Priority: backend entity metadata (is_row_key) > this config value > 'id'
   * Examples: 'prospect_id', 'id', 'session_id'
   */
  rowKeyField?: string;

  /** API endpoints configuration */
  api: {
    /** Endpoint to fetch table data (POST with filters/sort/pagination) */
    tableData: string;
    /** Endpoint to fetch entity metadata (columns definition) */
    entityMetadata: string;
    /** Optional endpoint to fetch filter configuration */
    filterConfig?: string;
    /** Endpoint to fetch filter options (filterset) */
    filterOptions?: string;
    /** Base endpoint for export/download functionality */
    exportData?: string;
  };

  /** Pagination configuration */
  pagination: {
    defaultPageSize: number;
    pageSizeOptions: number[];
  };

  /** Default sort configuration */
  defaultSort?: {
    field: string;
    order: 'asc' | 'desc';
  };

  /** Default filters to apply on initial load */
  defaultFilters?: Record<string, unknown>;

  /** Static filter configuration (if not fetched from API) */
  filters?: FilterConfig[];

  /** Quick filter buttons (shown next to Filters button) */
  quickFilters?: QuickFilterConfig[];

  /** Export/Download configuration */
  export?: {
    /** Enable export functionality */
    enabled: boolean;
    /** Available export formats */
    formats?: ('csv' | 'xlsx')[];
    /** Default export format */
    defaultFormat?: 'csv' | 'xlsx';
  };

  /** Custom row click handler (overrides drawer behavior) */
  onRowClick?: (row: TRow) => void;

  /** Row click navigation path generator (overrides drawer behavior, uses React Router) */
  rowClickNavigationPath?: (row: TRow) => string | null;

  /** Drawer/sidebar configuration for row details */
  drawer: {
    enabled: boolean;
    width: string; // e.g., '50vw', 'w-1/2'
    component: React.ComponentType<DrawerContentProps<TRow>>;
    urlParam: string; // URL parameter name for row ID
    props?: Partial<Omit<DrawerContentProps<TRow>, 'data' | 'onClose' | 'refreshTable' | 'isTableLoading'>>; // Additional props to pass to drawer component
    additionalUrlParams?: Record<string, string | number>; // Additional URL parameters to set when opening drawer
  };

  /** Custom empty state component */
  emptyState?: React.ComponentType;

  /** Custom loading state component */
  loadingState?: React.ComponentType;

  /** Custom error state component */
  errorState?: React.ComponentType<{ error: Error }>;
}
