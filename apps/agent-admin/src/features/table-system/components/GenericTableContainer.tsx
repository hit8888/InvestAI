import { useSearchParams, useNavigate } from 'react-router-dom';
import type { TablePageConfig } from '../types';
import type { UseGenericTableStateReturn } from '../hooks/useGenericTableState';
import { GenericTableHeader } from './GenericTableHeader';
import { GenericTableFilters } from './GenericTableFilters';
import { GenericTable } from './GenericTable';
import { GenericTablePagination } from './GenericTablePagination';
import { TableLoadingSkeleton } from './states/TableLoadingSkeleton';
import { TableEmptyState } from './states/TableEmptyState';
import { TableErrorState } from './states/TableErrorState';
import { TableLoadingOverlay } from './states/TableLoadingOverlay';
import { ColumnManagementProvider } from '../context/ColumnManagementContext';

interface GenericTableContainerProps<TRow = unknown> {
  config: TablePageConfig<TRow>;
  tableState: UseGenericTableStateReturn<TRow>;
}

/**
 * Container component that orchestrates all table UI elements
 * Handles loading states, empty states, errors, and data display
 */
export const GenericTableContainer = <TRow extends Record<string, unknown>>({
  config,
  tableState,
}: GenericTableContainerProps<TRow>) => {
  const [, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const {
    data,
    isLoading,
    isFetching,
    isError,
    error,
    refetch,
    columns,
    metadataColumns,
    visibleColumns,
    setColumnVisibility,
    setColumnOrder,
    resetVersion,
    rowKeyColumn,
    filterConfig,
    urlState,
    hasActiveFilters,
    isUserTriggeredFetch,
    allDefaultFilters,
  } = tableState;

  // Handle row click - priority: navigation path > custom handler > drawer
  const handleRowClick = (row: TRow) => {
    // Priority 1: Navigation path (uses React Router)
    if (config.rowClickNavigationPath) {
      const path = config.rowClickNavigationPath(row);
      if (path) {
        navigate(path);
        return;
      }
    }

    // Priority 2: Custom onClick handler
    if (config.onRowClick) {
      config.onRowClick(row);
      return;
    }

    // Priority 3: Drawer behavior (default)
    if (!config.drawer.enabled) return;

    const rowId = row[rowKeyColumn];
    if (rowId) {
      setSearchParams(
        (prev) => {
          prev.set(config.drawer.urlParam, String(rowId));
          return prev;
        },
        { replace: false },
      );
    }
  };

  // Error state
  if (isError && error) {
    const ErrorComponent = config.errorState || TableErrorState;
    return (
      <div className="flex h-full w-full flex-col">
        <ErrorComponent error={error} onRetry={refetch} />
      </div>
    );
  }

  // Initial loading state (no data yet)
  if (isLoading && !data) {
    const LoadingComponent = config.loadingState || TableLoadingSkeleton;
    return (
      <ColumnManagementProvider
        columns={columns}
        visibleColumns={visibleColumns}
        setColumnVisibility={setColumnVisibility}
        setColumnOrder={setColumnOrder}
        toggleColumnVisibility={tableState.toggleColumnVisibility}
        resetColumnVisibility={tableState.resetColumnVisibility}
      >
        <div className="flex h-full w-full max-w-full flex-col">
          <GenericTableHeader title={config.pageTitle} />
          <GenericTableFilters
            filters={urlState.filters}
            filterConfig={filterConfig}
            quickFilters={config.quickFilters}
            search={urlState.search}
            tableData={[]}
            defaultFilters={allDefaultFilters}
            filterOptionsEndpoint={config.api.filterOptions}
            onFilterChange={urlState.setFilter}
            onSearchChange={urlState.setSearch}
            onResetFilters={urlState.resetFilters}
            isLoadingConfig={tableState.isLoadingFilterConfig}
          />
          <div className="flex-1 overflow-hidden">
            <LoadingComponent />
          </div>
        </div>
      </ColumnManagementProvider>
    );
  }

  const tableData = data?.results ?? [];
  const isEmpty = tableData.length === 0;

  return (
    <ColumnManagementProvider
      columns={columns}
      visibleColumns={visibleColumns}
      setColumnVisibility={setColumnVisibility}
      setColumnOrder={setColumnOrder}
      toggleColumnVisibility={tableState.toggleColumnVisibility}
      resetColumnVisibility={tableState.resetColumnVisibility}
    >
      <div className="flex w-full max-w-full flex-col">
        {/* Title */}
        <GenericTableHeader title={config.pageTitle} />

        {/* Filters toolbar */}
        <GenericTableFilters
          filters={urlState.filters}
          filterConfig={filterConfig}
          quickFilters={config.quickFilters}
          search={urlState.search}
          tableData={tableData}
          defaultFilters={allDefaultFilters}
          filterOptionsEndpoint={config.api.filterOptions}
          onFilterChange={urlState.setFilter}
          onSearchChange={urlState.setSearch}
          onResetFilters={urlState.resetFilters}
          isLoadingConfig={tableState.isLoadingFilterConfig}
        />

        {/* Table content */}
        <div className="relative min-h-0 min-w-0 max-w-full">
          {isEmpty ? (
            // Empty state
            <div className="flex h-full items-center justify-center">
              {config.emptyState ? (
                <config.emptyState />
              ) : (
                <TableEmptyState
                  hasFilters={hasActiveFilters}
                  onClearFilters={hasActiveFilters ? urlState.resetFilters : undefined}
                />
              )}
            </div>
          ) : (
            // Table with data
            <div className="relative mb-6">
              <GenericTable
                data={tableData}
                columns={columns}
                metadataColumns={metadataColumns}
                visibleColumns={visibleColumns}
                resetVersion={resetVersion}
                sortBy={urlState.sortBy}
                sortOrder={urlState.sortOrder}
                onSortChange={urlState.setSort}
                onRowClick={handleRowClick}
                isLoading={isLoading}
                rowKeyColumn={rowKeyColumn}
              />

              {/* Loading overlay - only show for user-triggered fetches (filters, sort, page changes) */}
              {/* Background refetches are silent */}
              {isUserTriggeredFetch && isFetching && <TableLoadingOverlay />}
            </div>
          )}
        </div>

        {/* Pagination */}
        {!isEmpty && (
          <GenericTablePagination
            currentPage={data?.current_page ?? 1}
            pageSize={data?.page_size ?? config.pagination.defaultPageSize}
            totalPages={data?.total_pages ?? 1}
            totalRecords={data?.total_records ?? 0}
            pageSizeOptions={config.pagination.pageSizeOptions}
            onPageChange={urlState.setPage}
            onPageSizeChange={urlState.setPageSize}
            isLoading={isLoading}
          />
        )}
      </div>
    </ColumnManagementProvider>
  );
};
