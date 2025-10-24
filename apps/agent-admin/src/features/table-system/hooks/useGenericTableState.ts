import { useMemo, useCallback, useRef, useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import adminApiClient from '@meaku/core/adminHttp/client';
import type {
  TablePageConfig,
  TableResponse,
  TableRequestPayload,
  EntityMetadataResponse,
  EntityMetadataColumn,
  FilterConfig,
  TableColumnDefinition,
} from '../types';
import { useTableUrlState } from './useTableUrlState';
import { useColumnPreferences } from './useColumnPreferences';
import {
  transformEntityMetadataToColumns,
  getRowKeyColumn,
  getDefaultVisibleColumns,
} from '../utils/columnHelpers.tsx';
import {
  extractManualFilterDefaults,
  generateFilterConfig,
  buildRequestPayload,
  calculateAppliedFiltersCount,
  getRowById as getRowByIdHelper,
} from './useGenericTableState.helpers';

/**
 * Hook return value
 */
export interface UseGenericTableStateReturn<TRow = unknown> {
  // URL state
  urlState: ReturnType<typeof useTableUrlState>;

  // Data
  data: TableResponse<TRow> | undefined;
  isLoading: boolean;
  isFetching: boolean;
  isError: boolean;
  error: Error | null;
  refetch: () => void;

  // Columns
  columns: TableColumnDefinition<TRow>[];
  metadataColumns: EntityMetadataColumn[]; // Raw metadata columns for smart rendering
  visibleColumns: string[];
  setColumnVisibility: (columnId: string, visible: boolean) => void;
  setColumnOrder: (columnIds: string[]) => void;
  toggleColumnVisibility: (columnId: string) => void;
  resetColumnVisibility: () => void;
  resetVersion: number;
  rowKeyColumn: string;

  // Filters
  filterConfig: FilterConfig[];
  isLoadingFilterConfig: boolean;
  appliedFiltersCount: number;
  hasActiveFilters: boolean;

  // Helpers
  getRowById: (id: string) => TRow | undefined;
  requestPayload: TableRequestPayload;

  // User interaction tracking
  isUserTriggeredFetch: boolean;

  // Default filters (includes manual filter defaults)
  allDefaultFilters: Record<string, unknown>;
}

/**
 * Main composition hook for generic table state
 * Brings together URL state, data fetching, columns, and filters
 */
export const useGenericTableState = <TRow = unknown>(
  config: TablePageConfig<TRow>,
): UseGenericTableStateReturn<TRow> => {
  // Extract default values from manual filters (e.g., toggle filters)
  const manualFilterDefaults = useMemo(() => {
    return extractManualFilterDefaults(config.filters);
  }, [config.filters]);

  // Merge manual filter defaults with config default filters
  const allDefaultFilters = useMemo(
    () => ({ ...config.defaultFilters, ...manualFilterDefaults }),
    [config.defaultFilters, manualFilterDefaults],
  );

  // URL state management
  const urlState = useTableUrlState({
    pageKey: config.pageKey,
    defaultPagination: config.pagination,
    defaultSort: config.defaultSort,
    defaultFilters: allDefaultFilters,
  });

  // Fetch entity metadata (columns)
  const {
    data: entityMetadata,
    isLoading: isLoadingMetadata,
    isError: isErrorMetadata,
    error: errorMetadata,
  } = useQuery<EntityMetadataResponse>({
    queryKey: [config.pageKey, 'entity-metadata'],
    queryFn: async () => {
      const response = await adminApiClient.get(config.api.entityMetadata);
      return { columns: response.data };
    },
    staleTime: 10 * 60 * 1000, // 10 minutes
    refetchOnWindowFocus: false,
  });

  // Transform metadata to column definitions
  const columns = useMemo<TableColumnDefinition<TRow>[]>(() => {
    if (!entityMetadata?.columns) return [];
    return transformEntityMetadataToColumns<TRow>(entityMetadata.columns);
  }, [entityMetadata]);

  // Get row key column
  const rowKeyColumn = useMemo(() => {
    if (!entityMetadata?.columns) return config.rowKeyField || 'id';
    return getRowKeyColumn(entityMetadata.columns, config.rowKeyField);
  }, [entityMetadata, config.rowKeyField]);

  // Column visibility preferences
  const defaultVisibleColumns = useMemo(() => {
    const defaults = getDefaultVisibleColumns(columns);
    return defaults;
  }, [columns]);

  const {
    visibleColumns,
    setColumnVisibility,
    setColumnOrder,
    toggleColumnVisibility,
    resetColumnVisibility,
    resetVersion,
  } = useColumnPreferences(config.pageKey, defaultVisibleColumns);

  // Generate filter configuration from entity metadata
  const filterConfig = useMemo<FilterConfig[]>(() => {
    return generateFilterConfig(entityMetadata, config.filters);
  }, [entityMetadata, config.filters]);

  const isLoadingFilterConfig = isLoadingMetadata;

  // Track user-triggered fetches (filter/sort/page changes)
  const prevPayloadRef = useRef<string | null>(null);
  const [isUserTriggeredFetch, setIsUserTriggeredFetch] = useState(false);

  // Build request payload
  const requestPayload = useMemo<TableRequestPayload>(() => {
    return buildRequestPayload(
      {
        ...urlState,
        sortBy: urlState.sortBy || undefined,
        sortOrder: urlState.sortOrder || undefined,
      },
      allDefaultFilters,
      filterConfig,
    );
  }, [urlState, allDefaultFilters, filterConfig]);

  // Detect when request payload changes (user action)
  useEffect(() => {
    const currentPayload = JSON.stringify(requestPayload);

    if (prevPayloadRef.current !== null && prevPayloadRef.current !== currentPayload) {
      // Payload changed - user took an action (filter, sort, page, search)
      setIsUserTriggeredFetch(true);
    }

    prevPayloadRef.current = currentPayload;
  }, [requestPayload]);

  // Fetch table data
  const {
    data: tableData,
    isLoading: isLoadingData,
    isFetching: isFetchingData,
    isError: isErrorData,
    error: errorData,
    refetch,
  } = useQuery<TableResponse<TRow>>({
    // Use JSON.stringify to ensure object changes trigger refetch
    queryKey: [config.pageKey, 'table-data', JSON.stringify(requestPayload)],
    queryFn: async () => {
      const response = await adminApiClient.post(config.api.tableData, requestPayload);
      return response.data;
    },
    enabled: urlState.isReady && !!entityMetadata,
    staleTime: 1 * 60 * 1000, // Cache for 1 minute - shows cached data instantly
    gcTime: 5 * 60 * 1000, // Keep in memory for 5 minutes
    refetchOnWindowFocus: true, // Silent background refetch when user returns
    refetchOnMount: 'always', // Check for fresh data on mount
    placeholderData: (previousData) => previousData, // Keep previous data while fetching
  });

  // Reset user-triggered flag after fetch completes
  useEffect(() => {
    if (!isFetchingData && isUserTriggeredFetch) {
      setIsUserTriggeredFetch(false);
    }
  }, [isFetchingData, isUserTriggeredFetch]);

  // Computed values - exclude default filters from count
  const appliedFiltersCount = useMemo(() => {
    return calculateAppliedFiltersCount(urlState.filters, urlState.search, allDefaultFilters);
  }, [urlState.filters, urlState.search, allDefaultFilters]);

  const hasActiveFilters = appliedFiltersCount > 0;

  // Helper to get row by ID
  const getRowById = useCallback(
    (id: string): TRow | undefined => {
      return getRowByIdHelper(tableData, rowKeyColumn, id);
    },
    [tableData, rowKeyColumn],
  );

  return {
    urlState,
    data: tableData,
    isLoading: isLoadingData || isLoadingMetadata,
    isFetching: isFetchingData,
    isError: isErrorData || isErrorMetadata,
    error: (errorData || errorMetadata) as Error | null,
    refetch,
    columns,
    metadataColumns: entityMetadata?.columns ?? [], // Raw metadata columns for smart rendering
    visibleColumns,
    setColumnVisibility,
    setColumnOrder,
    toggleColumnVisibility,
    resetColumnVisibility,
    resetVersion,
    rowKeyColumn,
    filterConfig,
    isLoadingFilterConfig,
    appliedFiltersCount,
    hasActiveFilters,
    getRowById,
    requestPayload,
    isUserTriggeredFetch,
    allDefaultFilters,
  };
};
