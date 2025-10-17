/**
 * Supported filter types
 */
export type FilterType = 'multi-select' | 'date-range' | 'search' | 'text' | 'number' | 'toggle';

/**
 * Option for select-based filters
 */
export interface FilterOption {
  value: string | number;
  label: string;
  // Extended data for rich display (avatar, flags, badges, etc.)
  metadata?: {
    avatarUrl?: string;
    companyLogo?: string;
    flagUrl?: string;
    fullName?: string;
    email?: string;
    [key: string]: unknown;
  };
}

/**
 * Configuration for a single filter
 */
export interface FilterConfig {
  /** Unique identifier for the filter */
  id: string;

  /** Display label */
  label: string;

  /** Type of filter UI to render */
  type: FilterType;

  /** Lucide icon name */
  icon?: string;

  /** How to display filter options (default, country_flag, user_avatar, intent_badge, etc) */
  displayType?: 'default' | 'country_flag' | 'user_avatar' | 'intent_badge';

  /** How options are fetched/transformed (DIRECT from API, ID_LOOKUP from table data) */
  optionsType?: 'DIRECT' | 'ID_LOOKUP';

  /** Options for select-based filters */
  options?: FilterOption[];

  /** Default value */
  defaultValue?: unknown;

  /** Placeholder text */
  placeholder?: string;

  /** Whether the filter is required */
  required?: boolean;

  /** For toggle filters: the default filter key this toggle controls */
  controlsDefaultFilter?: string;

  /** For toggle filters: if true, inverts the boolean value of the controlled default filter when toggle is ON */
  invertsDefaultFilterValue?: boolean;
}

/**
 * Filter values state
 * Key-value pairs where key is filter ID
 */
export type FilterValues = Record<string, unknown>;

/**
 * Quick filter button configuration
 * Shows as a button next to the Filters button for common filters
 */
export interface QuickFilterConfig {
  /** Unique identifier */
  id: string;

  /** Display label */
  label: string;

  /** Lucide icon name */
  icon?: string;

  /** Filter field this quick filter controls */
  filterField: string;

  /** Filter value to apply when active */
  filterValue: unknown;

  /** Filter operator to use */
  filterOperator: 'eq' | 'in' | 'is_not_null' | 'is_null';
}

/**
 * Date range filter value
 */
export interface DateRangeValue {
  from: string | null; // ISO date string
  to: string | null; // ISO date string
}
