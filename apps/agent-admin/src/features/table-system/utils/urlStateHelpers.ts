import { FilterValues, DateRangeValue, SortOrder } from '../types';

/**
 * URL state structure
 */
export interface UrlState {
  page: number;
  pageSize: number;
  sortBy: string | null;
  sortOrder: SortOrder | null;
  filters: FilterValues;
  search: string;
}

/**
 * Parse URL search params into state
 */
export const parseUrlParams = (
  searchParams: URLSearchParams,
  defaults: {
    defaultPageSize: number;
    defaultSort?: { field: string; order: SortOrder };
  },
  excludeParams: string[] = [],
): UrlState => {
  // Parse pagination
  const page = parseInt(searchParams.get('page') || '1', 10);
  const pageSize = parseInt(searchParams.get('pageSize') || String(defaults.defaultPageSize), 10);

  // Parse sort
  const sortBy = searchParams.get('sortBy') || defaults.defaultSort?.field || null;
  const sortOrder = (searchParams.get('sortOrder') as SortOrder) || defaults.defaultSort?.order || null;

  // Parse search
  const search = searchParams.get('search') || '';

  // Parse filters
  const filters: FilterValues = {};

  // Get all filter params (anything not page/pageSize/sortBy/sortOrder/search or excluded params)
  const systemParams = new Set(['page', 'pageSize', 'sortBy', 'sortOrder', 'search', ...excludeParams]);

  searchParams.forEach((value, key) => {
    if (!systemParams.has(key)) {
      // Check if it's a date range (dateFrom/dateTo)
      if (key.endsWith('From') || key.endsWith('To')) {
        const baseKey = key.replace(/(From|To)$/, '');
        if (!filters[baseKey]) {
          filters[baseKey] = { from: null, to: null } as DateRangeValue;
        }

        if (key.endsWith('From')) {
          (filters[baseKey] as DateRangeValue).from = value;
        } else {
          (filters[baseKey] as DateRangeValue).to = value;
        }
      } else {
        // Multi-select or single value
        // Check if it's the special _null_ marker
        if (value === '_null_') {
          filters[key] = null;
        }
        // Check if comma-separated
        else if (value.includes(',')) {
          filters[key] = value.split(',').filter(Boolean);
        } else {
          filters[key] = value;
        }
      }
    }
  });

  return {
    page: isNaN(page) || page < 1 ? 1 : page,
    pageSize: isNaN(pageSize) || pageSize < 1 ? defaults.defaultPageSize : pageSize,
    sortBy,
    sortOrder,
    filters,
    search,
  };
};

/**
 * Serialize state to URL search params
 * Only adds params that differ from defaults (don't pollute URL with defaults)
 */
export const serializeToUrlParams = (
  state: UrlState,
  options?: {
    includePageSize?: boolean;
    includeSort?: boolean;
    excludeFilters?: Set<string>; // Filters to exclude from URL (e.g., default filters)
  },
): URLSearchParams => {
  const params = new URLSearchParams();

  // Add pagination (only if not page 1)
  if (state.page > 1) {
    params.set('page', String(state.page));
  }

  // Only add pageSize if user changed it or it was in URL
  if (options?.includePageSize && state.pageSize) {
    params.set('pageSize', String(state.pageSize));
  }

  // Only add sort if user explicitly sorted or it was in URL
  if (options?.includeSort && state.sortBy && state.sortOrder) {
    params.set('sortBy', state.sortBy);
    params.set('sortOrder', state.sortOrder);
  }

  // Add search
  if (state.search) {
    params.set('search', state.search);
  }

  // Add filters (excluding default filters)
  Object.entries(state.filters).forEach(([key, value]) => {
    // Skip default filters (they shouldn't appear in URL)
    if (options?.excludeFilters?.has(key)) {
      return;
    }

    if (value === undefined || value === '') {
      return; // Skip undefined and empty strings
    }

    // Handle null values (used for is_not_null filters)
    if (value === null) {
      params.set(key, '_null_');
      return;
    }

    // Handle date range
    if (typeof value === 'object' && 'from' in value && 'to' in value) {
      const dateRange = value as DateRangeValue;
      if (dateRange.from) {
        params.set(`${key}From`, dateRange.from);
      }
      if (dateRange.to) {
        params.set(`${key}To`, dateRange.to);
      }
    }
    // Handle arrays (multi-select)
    else if (Array.isArray(value)) {
      if (value.length > 0) {
        params.set(key, value.join(','));
      }
    }
    // Handle primitives
    else {
      params.set(key, String(value));
    }
  });

  return params;
};

/**
 * Check if two URL states are equal
 */
export const areUrlStatesEqual = (a: UrlState, b: UrlState): boolean => {
  return (
    a.page === b.page &&
    a.pageSize === b.pageSize &&
    a.sortBy === b.sortBy &&
    a.sortOrder === b.sortOrder &&
    a.search === b.search &&
    JSON.stringify(a.filters) === JSON.stringify(b.filters)
  );
};
