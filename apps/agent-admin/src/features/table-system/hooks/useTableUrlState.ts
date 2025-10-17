import { useState, useEffect, useCallback, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FilterValues, SortOrder } from '../types';
import { parseUrlParams, serializeToUrlParams, UrlState } from '../utils/urlStateHelpers';
import { useDebouncedCallback } from './useDebouncedCallback';

/**
 * Hook configuration
 */
interface UseTableUrlStateProps {
  pageKey: string;
  defaultPagination: { defaultPageSize: number };
  defaultSort?: { field: string; order: SortOrder };
  defaultFilters?: Record<string, unknown>;
  debounceMs?: number;
}

/**
 * Hook return value
 */
interface UseTableUrlStateReturn {
  // Pagination
  page: number;
  pageSize: number;
  setPage: (page: number) => void;
  setPageSize: (size: number) => void;

  // Sort
  sortBy: string | null;
  sortOrder: SortOrder | null;
  setSort: (field: string | null, order: SortOrder | null) => void;

  // Filters
  filters: FilterValues;
  setFilter: <K extends string>(key: K, value: unknown) => void;
  setFilters: (filters: Partial<FilterValues>) => void;
  resetFilters: () => void;

  // Search
  search: string;
  setSearch: (value: string) => void;

  // State
  isReady: boolean;
  resetAll: () => void;
}

/**
 * Generic hook for managing table state in URL parameters
 * Handles pagination, sorting, filtering, and search
 */
export const useTableUrlState = ({
  pageKey: _pageKey,
  defaultPagination,
  defaultSort,
  defaultFilters = {},
  debounceMs = 300,
}: UseTableUrlStateProps): UseTableUrlStateReturn => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [isReady, setIsReady] = useState(false);

  // Parse initial state from URL (only on mount)
  const initialState = useMemo(
    () => {
      // Exclude common drawer/UI-only params from being treated as filters
      const uiOnlyParams = ['rowId', 'leadId', 'prospectId', 'conversationId', 'visitorId', 'companyId'];
      const parsed = parseUrlParams(
        searchParams,
        {
          defaultPageSize: defaultPagination.defaultPageSize,
          defaultSort,
        },
        uiOnlyParams,
      );
      // Merge default filters with parsed filters (URL takes precedence)
      return {
        ...parsed,
        filters: { ...defaultFilters, ...parsed.filters },
      };
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [], // Intentionally empty - only parse on mount
  );

  // Local state
  const [state, setState] = useState<UrlState>(initialState);

  // Track what was originally in URL vs defaults
  const [urlHadPageSize] = useState(() => searchParams.has('pageSize'));
  const [urlHadSort] = useState(() => searchParams.has('sortBy') && searchParams.has('sortOrder'));

  // Create debounced URL sync function
  const debouncedUrlSync = useDebouncedCallback(
    useCallback(() => {
      // Only exclude filters that have the SAME value as defaults (not just keys)
      const filtersToExclude = new Set<string>();
      Object.entries(defaultFilters).forEach(([key, defaultValue]) => {
        const currentValue = state.filters[key];
        // Exclude if value hasn't changed from default
        if (JSON.stringify(currentValue) === JSON.stringify(defaultValue)) {
          filtersToExclude.add(key);
        }
      });

      const params = serializeToUrlParams(state, {
        includePageSize: urlHadPageSize || state.pageSize !== defaultPagination.defaultPageSize,
        includeSort: urlHadSort || state.sortBy !== defaultSort?.field || state.sortOrder !== defaultSort?.order,
        excludeFilters: filtersToExclude,
      });

      // Preserve URL params that this hook doesn't manage (e.g., drawer rowId)
      setSearchParams(
        (prev) => {
          // Start with new params from table state
          const newParams = new URLSearchParams(params);

          // Build list of ALL filter-related keys (including date range variants)
          const filterKeys = new Set<string>();
          Object.keys(state.filters).forEach((key) => {
            filterKeys.add(key);
            // Also track date range variants (e.g., updated_onFrom, updated_onTo)
            filterKeys.add(`${key}From`);
            filterKeys.add(`${key}To`);
          });

          // Also check previous URL params for filter keys that might have been removed
          prev.forEach((_, key) => {
            // If it ends with From/To, it's a date range part - track the base key too
            if (key.endsWith('From') || key.endsWith('To')) {
              const baseKey = key.replace(/(From|To)$/, '');
              filterKeys.add(baseKey);
              filterKeys.add(key);
            }
          });

          // Preserve any params that aren't managed by table state
          const managedKeys = new Set(['page', 'pageSize', 'sortBy', 'sortOrder', 'search', ...filterKeys]);
          prev.forEach((value, key) => {
            if (!managedKeys.has(key)) {
              newParams.set(key, value);
            }
          });

          return newParams;
        },
        { replace: true },
      );
    }, [
      state,
      defaultFilters,
      urlHadPageSize,
      urlHadSort,
      defaultPagination.defaultPageSize,
      defaultSort,
      setSearchParams,
    ]),
    debounceMs,
  );

  // Sync state to URL (debounced)
  useEffect(() => {
    if (!isReady) return;
    debouncedUrlSync();
  }, [state, isReady, debouncedUrlSync]);

  // Mark ready after initial render
  useEffect(() => {
    setIsReady(true);
  }, []);

  // Pagination handlers
  const setPage = useCallback((page: number) => {
    setState((prev) => ({ ...prev, page }));
  }, []);

  const setPageSize = useCallback((pageSize: number) => {
    setState((prev) => ({ ...prev, pageSize, page: 1 })); // Reset to page 1
  }, []);

  // Sort handlers
  const setSort = useCallback((field: string | null, order: SortOrder | null) => {
    setState((prev) => ({
      ...prev,
      sortBy: field,
      sortOrder: order,
    }));
  }, []);

  // Filter handlers
  const setFilter = useCallback(<K extends string>(key: K, value: unknown) => {
    setState((prev) => {
      const newFilters = { ...prev.filters };

      // If value is undefined, remove the key entirely
      if (value === undefined) {
        delete newFilters[key];
      } else {
        newFilters[key] = value;
      }

      return {
        ...prev,
        filters: newFilters,
        page: 1, // Reset to page 1 when filtering
      };
    });
  }, []);

  const setFilters = useCallback((filters: Partial<FilterValues>) => {
    setState((prev) => ({
      ...prev,
      filters: {
        ...prev.filters,
        ...filters,
      },
      page: 1,
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setState((prev) => ({
      ...prev,
      filters: {},
      search: '',
      page: 1,
    }));
  }, []);

  // Search handler
  const setSearch = useCallback((search: string) => {
    setState((prev) => ({
      ...prev,
      search,
      page: 1, // Reset to page 1 when searching
    }));
  }, []);

  // Reset all
  const resetAll = useCallback(() => {
    setState({
      page: 1,
      pageSize: defaultPagination.defaultPageSize,
      sortBy: defaultSort?.field ?? null,
      sortOrder: defaultSort?.order ?? null,
      filters: {},
      search: '',
    });
  }, [defaultPagination, defaultSort]);

  return {
    page: state.page,
    pageSize: state.pageSize,
    setPage,
    setPageSize,
    sortBy: state.sortBy,
    sortOrder: state.sortOrder,
    setSort,
    filters: state.filters,
    setFilter,
    setFilters,
    resetFilters,
    search: state.search,
    setSearch,
    isReady,
    resetAll,
  };
};
