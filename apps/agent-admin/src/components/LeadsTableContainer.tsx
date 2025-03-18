import { useEffect, useMemo } from 'react';

import { useFormattedColumns } from '../hooks/useFormattedColumns';
import { usePagination } from '../hooks/usePagination.tsx';
import useLeadsTableQuery from '../queries/query/useLeadsTableQuery';
import TableViewContent from './TableViewContent';
import TableDataManager from '../managers/TableDataManager';
import TablePagination from './tableComp/TablePagination';
import TableFiltersWithHeaderLabel from './TableFiltersWithHeaderLabel.tsx';

import { LEADS_PAGE_COLUMN_LISTS, PAGINATION_PER_PAGE_OPTIONS_FOR_LEADS_TABLE } from '../utils/constants';
import {
  collectAppliedFilters,
  getAllFilterAppliedValues,
  getFormattedColumnsList,
  getMappedDataFromResponseForLeadsTableView,
  getSortingAppliedValues,
} from '../utils/common';

import { ColumnDefinition } from '@meaku/core/types/admin/admin-table';
import { LeadsPayload } from '@meaku/core/types/admin/api';
import { LeadsTableDisplayContent, LeadsTableViewContent } from '@meaku/core/types/admin/admin';
import { useSortFilterStore } from '../stores/useSortFilterStore.ts';
import { useAllFilterStore } from '../stores/useAllFilterStore.ts';
import { LEADS_PAGE } from '@meaku/core/utils/index';
import { useDebouncedValue } from '@meaku/core/hooks/useDebouncedValue';
import { useTableStore } from '../stores/useTableStore.ts';
import { useQueryOptions } from '../hooks/useQueryOptions.ts';
import { useInitializeFilterPreferences } from '../hooks/useInitializeFilterPreferences.tsx';

const LEADS_PAGE_NUMBER_OF_FILTERS: number = 2;

const LeadsTableContainer = () => {
  const { currentPage, itemsPerPage, handlePageChange, handleItemsPerPageChange } = usePagination({
    pageType: LEADS_PAGE,
  });

  useInitializeFilterPreferences(LEADS_PAGE);

  const sortState = useSortFilterStore((state) => state.leads);
  const filterState = useAllFilterStore((state) => state.leads);

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
    return getAllFilterAppliedValues(filterState, LEADS_PAGE);
  }, [filterState]);

  const payloadData: LeadsPayload = useMemo(() => {
    return {
      filters: allAppliedFilterValues,
      sort: getSortingAppliedValues(sortState, LEADS_PAGE),
      search: '',
      page: currentPage,
      page_size: itemsPerPage,
    };
  }, [allAppliedFilterValues, sortState, currentPage, itemsPerPage]);

  // Use debounced payload to prevent excessive API calls
  const debouncedPayloadData = useDebouncedValue(payloadData);
  const queryOptions = useQueryOptions();

  const { data, isLoading, isError } = useLeadsTableQuery({
    payload: debouncedPayloadData,
    queryOptions,
  });

  const { setTableData } = useTableStore();

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

  const leadsPageColumns: ColumnDefinition[] = getFormattedColumnsList(LEADS_PAGE_COLUMN_LISTS, 200);
  const resultantLeadsColumns = useFormattedColumns(leadsPageColumns);

  if (isError) return null;

  const hasNoRecords = totalRecords === 0;
  const showPagination = !isLoading && !hasNoRecords;

  const areAllFiltersApplied = allAppliedFilterValues.length === LEADS_PAGE_NUMBER_OF_FILTERS;

  return (
    <div className="flex w-full flex-1 flex-col items-start gap-2 self-stretch">
      <div className="flex flex-col items-start gap-4 self-stretch">
        <div className="flex flex-col items-start self-stretch bg-white">
          <TableFiltersWithHeaderLabel
            payloadData={debouncedPayloadData}
            disabledState={hasNoRecords}
            key={LEADS_PAGE}
            page={LEADS_PAGE}
          />
          <TableViewContent
            key={'leads-table-container'}
            isLoading={isLoading}
            totalRecords={totalRecords}
            areAllFiltersApplied={areAllFiltersApplied}
            tableData={leadsData}
            columnHeaderData={resultantLeadsColumns as ColumnDefinition[]}
          />
        </div>
        <div className="flex items-center justify-end gap-4 self-stretch">
          {showPagination ? (
            <TablePagination
              tableType={LEADS_PAGE}
              totalPages={totalPages}
              totalItems={pageSize === 0 ? pageSize : totalRecords}
              itemsPerPage={itemsPerPage}
              onItemsPerPageChange={handleItemsPerPageChange}
              handlePageChange={handlePageChange}
              currentPage={currentPage}
              paginationPerPageOptions={PAGINATION_PER_PAGE_OPTIONS_FOR_LEADS_TABLE}
            />
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default LeadsTableContainer;
