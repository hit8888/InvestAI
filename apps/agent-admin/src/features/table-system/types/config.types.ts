import { FilterConfig, QuickFilterConfig } from './filter.types';

/**
 * Drawer content component props
 */
export interface DrawerContentProps<TRow = unknown> {
  data: TRow;
  onClose: () => void;
  refreshTable: () => void;
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
  };

  /** Custom empty state component */
  emptyState?: React.ComponentType;

  /** Custom loading state component */
  loadingState?: React.ComponentType;

  /** Custom error state component */
  errorState?: React.ComponentType<{ error: Error }>;
}
