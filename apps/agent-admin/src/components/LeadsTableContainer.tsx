import { useEffect, useMemo, useState } from 'react';

import { useFormattedColumns } from '../hooks/useFormattedColumns';
import { usePagination } from '../hooks/usePagination.tsx';
import useLeadsTableQuery from '../queries/query/useLeadsTableQuery';
import TableViewContent from './TableViewContent';
import TableDataManager from '../managers/TableDataManager';
import TablePagination from './tableComp/TablePagination';
import TableFiltersWithHeaderLabel from './TableFiltersWithHeaderLabel.tsx';

import { PAGINATION_PER_PAGE_OPTIONS_FOR_LEADS_TABLE } from '../utils/constants';
import {
  collectAppliedFilters,
  getAllFilterAppliedValues,
  getFormattedColumnsList,
  getMappedDataFromResponseForLeadsTableView,
  getSortingAppliedValues,
} from '../utils/common';

import { ColumnDefinition } from '@meaku/core/types/admin/admin-table';
import { LeadsPayload } from '@meaku/core/types/admin/api';
import {
  LEADS_PAGE_TYPE,
  LeadsTableDisplayContent,
  LeadsTableViewContent,
  LINK_CLICKS_PAGE_TYPE,
} from '@meaku/core/types/admin/admin';
import { useSortFilterStore } from '../stores/useSortFilterStore.ts';
import { useAllFilterStore } from '../stores/useAllFilterStore.ts';
import { useDebouncedValue } from '@meaku/core/hooks/useDebouncedValue';
import { useTableStore } from '../stores/useTableStore.ts';
import { useQueryOptions } from '../hooks/useQueryOptions.ts';
import { useInitializeFilterPreferences } from '../hooks/useInitializeFilterPreferences.tsx';
import { useEntityMetadata } from '../context/EntityMetadataContext.tsx';
import ErrorState from '@breakout/design-system/components/layout/ErrorState';
import useAdminEventAnalytics from '@meaku/core/hooks/useAdminEventAnalytics';
import ANALYTICS_EVENT_NAMES from '@meaku/core/constants/analytics';

const LeadsTableContainer = ({
  pageType,
  columnList,
}: {
  pageType: LEADS_PAGE_TYPE | LINK_CLICKS_PAGE_TYPE;
  columnList: string[];
}) => {
  const { transformedEntityMetadata } = useEntityMetadata();
  const { currentPage, itemsPerPage, handlePageChange, handleItemsPerPageChange } = usePagination({
    pageType,
  });
  const { trackAdminEvent } = useAdminEventAnalytics();

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
    if (data && !(allAppliedFilterValues.length > 0)) {
      setTableData(data);
    }
  }, [data, allAppliedFilterValues, setTableData]);

  const tableManager = useMemo(() => {
    if (!data) return null;

    return new TableDataManager(data);
  }, [data]);

  const leadsData: LeadsTableDisplayContent[] = (tableManager?.getTableDataResults() ?? []).map((item) =>
    getMappedDataFromResponseForLeadsTableView(item as LeadsTableViewContent),
  );
  const paginatedData = tableManager?.getPaginatedTableData() ?? { total_records: 0, total_pages: 1, page_size: 0 };
  const { page_size: pageSize, total_records: totalRecords, total_pages: totalPages } = paginatedData;

  const leadsPageColumns: ColumnDefinition[] = getFormattedColumnsList(columnList, transformedEntityMetadata);
  const resultantLeadsColumns = useFormattedColumns(leadsPageColumns);

  const haveNoRecords = totalRecords === 0;

  const handleRowItemClick = (rowData: unknown) => {
    const leadDetails = (rowData ?? {}) as LeadsTableDisplayContent;

    trackAdminEvent(ANALYTICS_EVENT_NAMES.LEADS_ROW_CLICKED, {
      session_id: leadDetails.session_id,
    });
  };

  // Handle error states
  if (isError || tableError) {
    return <ErrorState />;
  }

  return (
    <div className="flex w-full flex-1 flex-col items-start gap-2 self-stretch">
      <div className="flex flex-col items-start gap-4 self-stretch">
        <div className="flex flex-col items-start self-stretch bg-white">
          <TableFiltersWithHeaderLabel
            isLoading={isLoading}
            payloadData={debouncedPayloadData}
            disabledState={haveNoRecords}
            key={pageType}
            page={pageType}
            onFiltersContainerHeightChange={setFilterContainerHeight}
          />
          <TableViewContent
            pageType={pageType}
            key={`${pageType}-table-container`}
            isLoading={isLoading}
            totalRecords={totalRecords}
            tableData={leadsData}
            columnHeaderData={resultantLeadsColumns as ColumnDefinition[]}
            filterContainerHeight={filterContainerHeight}
            onRowItemClick={handleRowItemClick}
          />
        </div>
        <div className="flex items-center justify-end gap-4 self-stretch">
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
      </div>
    </div>
  );
};

export default LeadsTableContainer;
