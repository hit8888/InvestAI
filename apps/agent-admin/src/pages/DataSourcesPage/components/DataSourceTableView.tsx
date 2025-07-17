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
import ErrorState from '@breakout/design-system/components/layout/ErrorState';
import { useSortFilterStore } from '../../../stores/useSortFilterStore';
import NudgeMessage from './NudgeMessage';
import { useParams } from 'react-router-dom';
import useDataSourceItemQuery from '../../../queries/query/useDataSourceItemQuery';

interface DataSourceTableViewProps {
  pageType: PaginationPageType;
}

const DataSourceTableView = ({ pageType }: DataSourceTableViewProps) => {
  const { webPageID, documentID } = useParams();
  const dataSourceID = Number(webPageID || documentID);
  const dataItemView = !!dataSourceID;

  const { currentPage, itemsPerPage, handlePageChange, handleItemsPerPageChange } = usePagination({
    pageType: pageType as PaginationPageType,
  });

  const {
    results,
    getPaginatedTableData,
    setTableData,
    selectedIds,
    error: dataSourceTableError,
  } = useDataSourceTableStore();
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
  const dataTableQueryOptions = useQueryOptions({ enabled: !dataItemView });
  const dataItemQueryOptions = useQueryOptions({ enabled: dataItemView });

  const {
    data: tableData,
    isLoading: tableDataLoading,
    isError: tableDataError,
  } = useDataSourceTableViewQuery({
    payload: debouncedPayloadData,
    queryOptions: dataTableQueryOptions,
    tableKey: pageType,
  });

  const {
    data: tableItemData,
    isLoading: tableItemLoading,
    isError: tableItemError,
  } = useDataSourceItemQuery({
    queryOptions: dataItemQueryOptions,
    tableKey: pageType,
    dataSourceID,
  });

  const isLoading = dataItemView ? tableItemLoading : tableDataLoading;
  const isError = dataItemView ? tableItemError : tableDataError;

  useEffect(() => {
    if (tableData && !dataItemView) {
      setTableData(tableData);
    }

    return () => {
      setTableData(null);
    };
  }, [tableData, dataItemView]);

  useEffect(() => {
    if (tableItemData && dataItemView) {
      setTableData({
        current_page: 1,
        page_size: 1,
        total_pages: 1,
        total_records: 1,
        results: [tableItemData],
      });
    }

    return () => {
      setTableData(null);
    };
  }, [tableItemData, dataItemView]);

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

  if (isError || dataSourceTableError) return <ErrorState />;

  return (
    <div className="flex w-full flex-1 flex-col items-start self-stretch">
      <DataSourceTableHeader
        key={pageType}
        page={pageType}
        totalRecords={totalRecords}
        isLoading={isLoading}
        areFiltersApplied={areFiltersApplied}
        onFilterContainerHeightChange={setFilterContainerHeight}
      />
      {isAllDataSourcesSelectedPerPage && <NudgeMessage itemsSelected={results.length} pageType={pageType} />}
      <DataSourceTableViewContent
        columnHeaderData={resultantConversationsColumns as ColumnDefinition[]}
        tableData={results}
        pageType={pageType}
        isLoading={isLoading}
        totalRecords={totalRecords}
        filterContainerHeight={filterContainerHeight}
      />
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
  );
};

export default DataSourceTableView;
