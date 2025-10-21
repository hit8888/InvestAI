import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import type { TablePageConfig } from '../types';
import type { UseGenericTableStateReturn } from '../hooks/useGenericTableState';
import type { ExportFormatType } from '@meaku/core/types/admin/api';
import { GenericTableHeader } from './GenericTableHeader';
import { GenericTableFilters } from './GenericTableFilters';
import { GenericTable } from './GenericTable';
import { GenericTablePagination } from './GenericTablePagination';
import { TableEmptyState } from './states/TableEmptyState';
import { TableErrorState } from './states/TableErrorState';
import { TableLoadingOverlay } from './states/TableLoadingOverlay';
import { ColumnManagementProvider } from '../context/ColumnManagementContext';
import adminApiClient from '@meaku/core/adminHttp/client';
import { createFilename, triggerDownload } from '../../../utils/download/downloadUtils';

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

  // Handle export/download
  const handleExport = async (format: ExportFormatType): Promise<boolean> => {
    if (!config.api.exportData) {
      toast.error('Export endpoint not configured');
      return false;
    }

    try {
      // Use the same request payload that's used for table data
      // This ensures export respects all filters, toggles, defaults, etc.
      const payload = tableState.requestPayload;

      // Make API request
      const response = await adminApiClient.post(`${config.api.exportData}${format.toLowerCase()}/`, payload, {
        responseType: 'blob',
      });

      if (response.status !== 200) {
        throw new Error('Export failed');
      }

      // Create blob and trigger download
      const blob = new Blob([response.data], {
        type: response.headers['content-type'],
      });
      const url = window.URL.createObjectURL(blob);
      const filename = createFilename(config.pageKey, format.toLowerCase());

      triggerDownload(url, filename);

      // Cleanup - delay revoke to avoid race condition with download
      // The download process is asynchronous, so we wait to ensure it has started
      setTimeout(() => window.URL.revokeObjectURL(url), 100);
      toast.success('Downloaded successfully');
      return true;
    } catch (error) {
      toast.error('Failed to download file');
      console.error('Export error:', error);
      return false;
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
          exportConfig={
            config.export?.enabled
              ? {
                  enabled: true,
                  formats: config.export.formats,
                  defaultFormat: config.export.defaultFormat,
                  onExport: handleExport,
                }
              : undefined
          }
        />

        {/* Table content */}
        <div className="relative min-h-0 min-w-0 max-w-full">
          {isEmpty && !isLoading ? (
            // Empty state - only show when not loading and has no data
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
            // Table (with data or loading shimmer)
            <div className="relative mb-4">
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
            pageSize={urlState.pageSize}
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
