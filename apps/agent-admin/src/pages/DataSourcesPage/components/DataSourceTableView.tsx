import { ColumnDefinition } from '@meaku/core/types/admin/admin-table';
import { useFormattedColumns } from '../../../hooks/useFormattedColumns';
import { usePagination } from '../../../hooks/usePagination';
import { useMemo, useEffect, useState } from 'react';
import { DataSourcePayload } from '@meaku/core/types/admin/api';
import { useDebouncedValue } from '@meaku/core/hooks/useDebouncedValue';
import { useQueryOptions } from '../../../hooks/useQueryOptions';
import useDataSourceTableViewQuery from '../../../queries/query/useDataSourceTableViewQuery';
import { PaginationPageType } from '@meaku/core/types/admin/admin';
import DataSourceTableViewContent from '../../../components/AgentManagement/DataSourceTableViewContent';
import { PAGINATION_PER_PAGE_OPTIONS_FOR_DATA_SOURCE_TABLE } from '../../../utils/constants';
import TablePagination from '../../../components/tableComp/TablePagination';
import { getDataSourcesFormattedColumnsList } from '../utils';
import { useDataSourceTableStore } from '../../../stores/useDataSourceTableStore';
import DataSourceTableHeader from './DataSourceTableHeader';
import { useAllFilterStore } from '../../../stores/useAllFilterStore';
import { collectAppliedFilters, getAllFilterAppliedValues, getSortingAppliedValues } from '../../../utils/common';
import ErrorState from '../../../components/AgentManagement/ErrorState';
import { useSortFilterStore } from '../../../stores/useSortFilterStore';
import Typography from '@breakout/design-system/components/Typography/index';

interface DataSourceTableViewProps {
  pageType: PaginationPageType;
}

const DataSourceTableView = ({ pageType }: DataSourceTableViewProps) => {
  const { currentPage, itemsPerPage, handlePageChange, handleItemsPerPageChange } = usePagination({
    pageType: pageType as PaginationPageType,
  });

  const { results, getPaginatedTableData, setTableData, selectedIds } = useDataSourceTableStore();
  const [filterContainerHeight, setFilterContainerHeight] = useState(0);

  const sortState = useSortFilterStore((state) => state[pageType as PaginationPageType]);
  const filterState = useAllFilterStore((state) => state[pageType as PaginationPageType]);

  // Reset to page 1 when filters changes
  const appliedFilters = collectAppliedFilters(filterState);
  useEffect(() => {
    if (!appliedFilters.length) {
      return;
    } else {
      handlePageChange(1);
    }
    if (!appliedFilters.length && currentPage !== 1) {
      handlePageChange(1);
    }
  }, [filterState]);

  const allAppliedFilterValues = useMemo(() => {
    return getAllFilterAppliedValues(filterState, pageType);
  }, [filterState]);

  const payloadData: DataSourcePayload = useMemo(() => {
    return {
      filters: allAppliedFilterValues,
      sort: getSortingAppliedValues(sortState, pageType),
      page: currentPage,
      page_size: itemsPerPage,
      search: filterState.searchTableContent,
    };
  }, [allAppliedFilterValues, currentPage, itemsPerPage, sortState, filterState.searchTableContent]);

  // Use debounced payload to prevent excessive API calls
  const debouncedPayloadData = useDebouncedValue(payloadData);
  const queryOptions = useQueryOptions();

  const { data, isLoading, isError } = useDataSourceTableViewQuery({
    payload: debouncedPayloadData,
    queryOptions,
    tableKey: pageType,
  });

  useEffect(() => {
    if (data) {
      setTableData(data);
    }

    return () => {
      setTableData(null);
    };
  }, [data]);

  const paginatedData = getPaginatedTableData() ?? { total_records: 0, total_pages: 1, page_size: 0 };
  const { page_size: pageSize, total_records: totalRecords, total_pages: totalPages } = paginatedData;

  const conversationsPageColumns: ColumnDefinition[] = getDataSourcesFormattedColumnsList(pageType);
  const resultantConversationsColumns = useFormattedColumns(conversationsPageColumns);

  const areFiltersApplied = useMemo(() => {
    return appliedFilters.length > 0;
  }, [appliedFilters]);

  const isAllDataSourcesSelectedPerPage = useMemo(() => {
    return selectedIds.length === results.length && results.length > 0;
  }, [selectedIds, results]);

  if (isError) return <ErrorState />;

  return (
    <div className="flex w-full flex-1 flex-col items-start self-stretch">
      <DataSourceTableHeader
        key={pageType}
        page={pageType}
        totalRecords={totalRecords}
        isLoading={isLoading}
        areFiltersApplied={areFiltersApplied}
        payloadData={debouncedPayloadData}
        onFilterContainerHeightChange={setFilterContainerHeight}
      />
      {isAllDataSourcesSelectedPerPage && (
        <div className="mb-1 flex w-full flex-col items-center self-stretch rounded-lg bg-gray-100 p-2">
          <Typography variant="body-16" textColor="gray500" align="center">
            All{' '}
            <span className="font-semibold text-system">
              {results.length} {pageType}
            </span>{' '}
            on this page are selected.
          </Typography>
        </div>
      )}
      <DataSourceTableViewContent
        columnHeaderData={resultantConversationsColumns as ColumnDefinition[]}
        tableData={results}
        pageType={pageType}
        isLoading={isLoading}
        totalRecords={totalRecords}
        filterContainerHeight={filterContainerHeight}
      />
      <div className="flex items-center justify-end gap-4 self-stretch pt-6">
        <TablePagination
          isLoading={isLoading}
          tableType={pageType as PaginationPageType}
          paginationPerPageOptions={PAGINATION_PER_PAGE_OPTIONS_FOR_DATA_SOURCE_TABLE}
          totalPages={totalPages}
          totalItems={pageSize === 0 ? pageSize : totalRecords}
          itemsPerPage={itemsPerPage}
          onItemsPerPageChange={handleItemsPerPageChange}
          handlePageChange={handlePageChange}
          currentPage={currentPage}
        />
      </div>
    </div>
  );
};

export default DataSourceTableView;
