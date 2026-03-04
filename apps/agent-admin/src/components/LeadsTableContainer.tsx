import { useEffect, useMemo, useState } from 'react';

import { useFormattedColumns } from '../hooks/useFormattedColumns';
import { usePagination } from '../hooks/usePagination.tsx';
import useLeadsTableQuery from '../queries/query/useLeadsTableQuery';
import TableDataManager from '../managers/TableDataManager';
import TablePagination from './tableComp/TablePagination';
import TableFiltersWithHeaderLabel from './TableFiltersWithHeaderLabel.tsx';

import { PAGINATION_PER_PAGE_OPTIONS_FOR_LEADS_TABLE, LINK_CLICKS_PAGE_COLUMN_LISTS } from '../utils/constants';
import {
  collectAppliedFilters,
  getAllFilterAppliedValues,
  getFormattedColumnsList,
  getMappedDataFromResponseForLeadsTableView,
  getSortingAppliedValues,
} from '../utils/common';

import { ColumnDefinition } from '@neuraltrade/core/types/admin/admin-table';
import { LeadsPayload } from '@neuraltrade/core/types/admin/api';
import {
  LEADS_PAGE_TYPE,
  LeadsTableDisplayContent,
  LeadsTableViewContent,
  LINK_CLICKS_PAGE_TYPE,
} from '@neuraltrade/core/types/admin/admin';
import { useSortFilterStore } from '../stores/useSortFilterStore.ts';
import { useAllFilterStore } from '../stores/useAllFilterStore.ts';
import { useDebouncedValue } from '@neuraltrade/core/hooks/useDebouncedValue';
import { useTableStore } from '../stores/useTableStore.ts';
import { useQueryOptions } from '../hooks/useQueryOptions.ts';
import { useInitializeFilterPreferences } from '../hooks/useInitializeFilterPreferences.tsx';
import { useEntityMetadata } from '../context/EntityMetadataContext.tsx';
import ErrorState from '@breakout/design-system/components/layout/ErrorState';
import usePageRouteState from '../hooks/usePageRouteState.tsx';
import NoDataFound from '@breakout/design-system/components/layout/NoDataFound';
import CommonTable from '@breakout/design-system/components/Table/CommonTable';
import TableViewShimmer from './ShimmerComponent/TableViewShimmer';
import { useSidebar } from '../context/SidebarContext.tsx';
import { SortValues } from '@neuraltrade/core/types/admin/sort';
import NoDataFoundWithSearchTerm from '@breakout/design-system/components/layout/NoDataFoundWithSearchTerm';

const LeadsTableContainer = ({ pageType }: { pageType: LEADS_PAGE_TYPE | LINK_CLICKS_PAGE_TYPE }) => {
  const { isLinkClicksPage } = usePageRouteState();
  const { entityMetadataHeaderMapping, entityMetadataColumnList } = useEntityMetadata();
  const { isSidebarOpen } = useSidebar();
  const { setSortValue } = useSortFilterStore();
  const sortValue = useSortFilterStore((state) => state[pageType] as SortValues);
  // TODO: Remove this once we have a proper way to get the column list for link clicks page
  // Link Clicks page contains different ordering and displaying of columns
  // - Need to add another entity type for this in the server backend
  const columnList = isLinkClicksPage ? LINK_CLICKS_PAGE_COLUMN_LISTS : entityMetadataColumnList;
  const { currentPage, itemsPerPage, handlePageChange, handleItemsPerPageChange } = usePagination({
    pageType,
  });

  useInitializeFilterPreferences(pageType);

  const sortState = useSortFilterStore((state) => state[pageType]);
  const filterState = useAllFilterStore((state) => state[pageType]);

  const [filterContainerHeight, setFilterContainerHeight] = useState(0);

  // Reset to page 1 when filters changes
  useEffect(() => {
    const appliedFilters = collectAppliedFilters(filterState);
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
  }, [filterState, pageType]);

  const payloadData: LeadsPayload = useMemo(() => {
    return {
      filters: allAppliedFilterValues,
      sort: getSortingAppliedValues(sortState, pageType),
      search: filterState.searchTableContent,
      page: currentPage,
      page_size: itemsPerPage,
    };
  }, [allAppliedFilterValues, sortState, pageType, filterState.searchTableContent, currentPage, itemsPerPage]);

  // Use debounced payload to prevent excessive API calls
  const debouncedPayloadData = useDebouncedValue(payloadData);
  const queryOptions = useQueryOptions();

  const { data, isLoading, isError } = useLeadsTableQuery({
    payload: debouncedPayloadData,
    queryOptions,
  });

  const { setTableData, error: tableError } = useTableStore();

  // When data changes, update the store
  useEffect(() => {
    if (data) {
      setTableData(data);
    }
  }, [data, setTableData]);

  const tableManager = useMemo(() => {
    if (!data) return null;

    return new TableDataManager(data);
  }, [data]);

  const leadsData: LeadsTableDisplayContent[] = (tableManager?.getTableDataResults() ?? []).map((item) =>
    getMappedDataFromResponseForLeadsTableView(item as LeadsTableViewContent),
  );
  const paginatedData = tableManager?.getPaginatedTableData() ?? { total_records: 0, total_pages: 1, page_size: 0 };
  const { page_size: pageSize, total_records: totalRecords, total_pages: totalPages } = paginatedData;

  const leadsPageColumns: ColumnDefinition[] = getFormattedColumnsList(columnList, entityMetadataHeaderMapping);
  const resultantLeadsColumns = useFormattedColumns(leadsPageColumns);

  const haveNoRecords = totalRecords === 0;

  const renderTableContent = () => {
    if (isLoading) {
      return <TableViewShimmer />;
    }

    if (!totalRecords && filterState.searchTableContent) {
      return <NoDataFoundWithSearchTerm searchTerm={filterState.searchTableContent} />;
    }

    if (!totalRecords) {
      return (
        <NoDataFound
          className="min-h-[60vh]"
          title="Waiting for activity"
          description="No leads generated from website visitor conversations yet, Time to get more leads."
        />
      );
    }

    return (
      <CommonTable
        pageType={pageType}
        tabularData={leadsData}
        columnHeaderData={resultantLeadsColumns as ColumnDefinition[]}
        filterContainerHeight={filterContainerHeight}
        isSidebarOpen={isSidebarOpen}
        setSortValue={setSortValue}
        sortValue={sortValue}
      />
    );
  };

  // Handle error states
  if (isError || tableError) {
    return <ErrorState />;
  }

  return (
    <div className="flex w-full flex-1 flex-col items-start gap-2 self-stretch">
      <div className="flex flex-1 flex-col items-start self-stretch bg-white">
        <TableFiltersWithHeaderLabel
          isLoading={isLoading}
          payloadData={debouncedPayloadData}
          disabledState={haveNoRecords && !filterState.searchTableContent}
          key={pageType}
          page={pageType}
          onFiltersContainerHeightChange={setFilterContainerHeight}
        />
        {renderTableContent()}
      </div>
      <TablePagination
        isLoading={isLoading}
        tableType={pageType}
        totalPages={totalPages}
        totalItems={pageSize === 0 ? pageSize : totalRecords}
        itemsPerPage={itemsPerPage}
        onItemsPerPageChange={handleItemsPerPageChange}
        handlePageChange={handlePageChange}
        currentPage={currentPage}
        paginationPerPageOptions={PAGINATION_PER_PAGE_OPTIONS_FOR_LEADS_TABLE}
      />
    </div>
  );
};

export default LeadsTableContainer;
