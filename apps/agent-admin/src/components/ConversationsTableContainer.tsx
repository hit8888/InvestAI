import { useEffect, useMemo, useState } from 'react';

import { useDebouncedValue } from '@neuraltrade/core/hooks/useDebouncedValue';
import { useFormattedColumns } from '../hooks/useFormattedColumns';
import { usePagination } from '../hooks/usePagination.tsx';
import useConversationsTableQuery from '../queries/query/useConversationsTableQuery';

import CommonTable from '@breakout/design-system/components/Table/CommonTable';
import TableDataManager from '../managers/TableDataManager';
import TablePagination from './tableComp/TablePagination';
import TableFiltersWithHeaderLabel from './TableFiltersWithHeaderLabel.tsx';

import { PAGINATION_PER_PAGE_OPTIONS_FOR_CONVERSATIONS_TABLE } from '../utils/constants';
import {
  collectAppliedFilters,
  getAllFilterAppliedValues,
  getFormattedColumnsList,
  getMappedDataFromResponseForConversationsTableView,
  getSortingAppliedValues,
} from '../utils/common';

import { ColumnDefinition } from '@neuraltrade/core/types/admin/admin-table';
import { ConversationsPayload } from '@neuraltrade/core/types/admin/api';
import { ConversationsTableDisplayContent, ConversationsTableViewContent } from '@neuraltrade/core/types/admin/admin';
import { useSortFilterStore } from '../stores/useSortFilterStore.ts';
import { useAllFilterStore } from '../stores/useAllFilterStore.ts';
import { CONVERSATIONS_PAGE } from '@neuraltrade/core/utils/index';
import { useTableStore } from '../stores/useTableStore.ts';
import { useQueryOptions } from '../hooks/useQueryOptions.ts';
import { useInitializeFilterPreferences } from '../hooks/useInitializeFilterPreferences.tsx';
import { useEntityMetadata } from '../context/EntityMetadataContext.tsx';
import ErrorState from '@breakout/design-system/components/layout/ErrorState';
import NoDataFound from '@breakout/design-system/components/layout/NoDataFound';
import TableViewShimmer from './ShimmerComponent/TableViewShimmer.tsx';
import { SortValues } from '@neuraltrade/core/types/admin/sort';
import { useSidebar } from '../context/SidebarContext.tsx';

const ConversationsTableContainer = () => {
  const { isSidebarOpen } = useSidebar();
  const { setSortValue } = useSortFilterStore();
  const sortValue = useSortFilterStore((state) => state[CONVERSATIONS_PAGE] as SortValues);
  const { entityMetadataHeaderMapping, entityMetadataColumnList } = useEntityMetadata();
  const { currentPage, itemsPerPage, handlePageChange, handleItemsPerPageChange } = usePagination({
    pageType: CONVERSATIONS_PAGE,
  });

  useInitializeFilterPreferences(CONVERSATIONS_PAGE);

  const sortState = useSortFilterStore((state) => state.conversations);
  const filterState = useAllFilterStore((state) => state.conversations);

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
    return getAllFilterAppliedValues(filterState, CONVERSATIONS_PAGE);
  }, [filterState]);

  const payloadData: ConversationsPayload = useMemo(() => {
    return {
      filters: allAppliedFilterValues,
      sort: getSortingAppliedValues(sortState, CONVERSATIONS_PAGE),
      page: currentPage,
      page_size: itemsPerPage,
      search: filterState.searchTableContent,
    };
  }, [allAppliedFilterValues, sortState, currentPage, itemsPerPage, filterState.searchTableContent]);

  // Use debounced payload to prevent excessive API calls
  const debouncedPayloadData = useDebouncedValue(payloadData);
  const queryOptions = useQueryOptions();

  const { data, isLoading, isError } = useConversationsTableQuery({
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

  const conversationsData: ConversationsTableDisplayContent[] = (tableManager?.getTableDataResults() ?? []).map(
    (item) => getMappedDataFromResponseForConversationsTableView(item as ConversationsTableViewContent),
  );
  const paginatedData = tableManager?.getPaginatedTableData() ?? { total_records: 0, total_pages: 1, page_size: 0 };
  const { page_size: pageSize, total_records: totalRecords, total_pages: totalPages } = paginatedData;

  const conversationsPageColumns: ColumnDefinition[] = getFormattedColumnsList(
    entityMetadataColumnList,
    entityMetadataHeaderMapping,
  );
  const resultantConversationsColumns = useFormattedColumns(conversationsPageColumns);

  const haveNoRecords = totalRecords === 0;

  const renderTableContent = () => {
    if (isLoading) {
      return <TableViewShimmer />;
    }

    if (!totalRecords && filterState.searchTableContent) {
      return (
        <div className="flex w-full items-center justify-center gap-2 p-10 text-2xl font-medium text-gray-500">
          <span>No results found for </span>
          <span className="text-primary">"{filterState.searchTableContent}"</span>
          <span>- Try adjusting your search terms</span>
        </div>
      );
    }

    if (!totalRecords) {
      return (
        <NoDataFound
          className="min-h-[60vh]"
          title="No conversations yet"
          description="No interactions or conversations from website visitors yet, Time to get more traffic."
        />
      );
    }

    return (
      <CommonTable
        pageType={CONVERSATIONS_PAGE}
        tabularData={conversationsData}
        columnHeaderData={resultantConversationsColumns as ColumnDefinition[]}
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
      <div className="flex flex-1 flex-col items-start self-stretch">
        <TableFiltersWithHeaderLabel
          isLoading={isLoading}
          payloadData={debouncedPayloadData}
          disabledState={haveNoRecords && !filterState.searchTableContent}
          key={CONVERSATIONS_PAGE}
          page={CONVERSATIONS_PAGE}
          onFiltersContainerHeightChange={setFilterContainerHeight}
        />
        {renderTableContent()}
      </div>
      <TablePagination
        isLoading={isLoading}
        tableType={CONVERSATIONS_PAGE}
        paginationPerPageOptions={PAGINATION_PER_PAGE_OPTIONS_FOR_CONVERSATIONS_TABLE}
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

export default ConversationsTableContainer;
