import { useEffect, useMemo } from 'react';
import { keepPreviousData } from '@tanstack/react-query';

import { useFormattedColumns } from '../hooks/useFormattedColumns';
import { usePagination } from '../hooks/usePagination.tsx';
import useLeadsTableQuery from '../queries/query/useLeadsTableQuery';

import SortFilter from './tableComp/SortFilter';
import TableViewContent from './TableViewContent';
import TableDataManager from '../managers/TableDataManager';
import TablePagination from './tableComp/TablePagination';
import AllFiltersContainer from './tableComp/AllFilters';

import { LEADS_PAGE_COLUMN_LISTS } from '../utils/constants';
import {
  getFormattedColumnsList,
  getTenantFromLocalStorage,
  getMappedDataFromResponseForLeadsTableView,
  getAllFilterAppliedValues,
  getSortingAppliedValues,
} from '../utils/common';

import { ColumnDefinition } from '@meaku/core/types/admin/admin-table';
import { LeadsPayload } from '@meaku/core/types/admin/api';
import { LeadsTableDisplayContent, LeadsTableViewContent } from '@meaku/core/types/admin/admin';
import { useSortFilterStore } from '../stores/useSortFilterStore.ts';
import { useAllFilterStore } from '../stores/useAllFilterStore.ts';
import { LEADS_PAGE } from '@meaku/core/utils/index';

const LeadsTableContainer = () => {
  const tenantName = getTenantFromLocalStorage();

  const { currentPage, itemsPerPage, handlePageChange, handleItemsPerPageChange } = usePagination({
    pageType: LEADS_PAGE,
  });

  const sortState = useSortFilterStore((state) => state.leads);
  const filterState = useAllFilterStore((state) => state.leads);

  // Reset to page 1 when filters changes
  useEffect(() => {
    handlePageChange(1);
  }, [filterState]);

  const payloadData: LeadsPayload = {
    filters: getAllFilterAppliedValues(filterState, LEADS_PAGE),
    sort: getSortingAppliedValues(sortState, LEADS_PAGE),
    search: '',
    page: currentPage,
    page_size: itemsPerPage,
  };

  const { data, isLoading, isError } = useLeadsTableQuery({
    payload: payloadData,
    tenantName: tenantName || '',
    queryOptions: {
      enabled: !!tenantName,
      placeholderData: keepPreviousData,
    },
  });

  const tableManager = useMemo(() => {
    if (!data) return null;

    return new TableDataManager(data);
  }, [data]);

  const leadsData: LeadsTableDisplayContent[] = (tableManager?.getTableDataResults() ?? []).map((item) =>
    getMappedDataFromResponseForLeadsTableView(item as LeadsTableViewContent),
  );
  const paginatedData = tableManager?.getPaginatedTableData() ?? { total_records: 0, total_pages: 1 };
  const { total_records: totalRecords, total_pages: totalPages } = paginatedData;

  const leadsPageColumns: ColumnDefinition[] = getFormattedColumnsList(LEADS_PAGE_COLUMN_LISTS, 200);
  const resultantLeadsColumns = useFormattedColumns(leadsPageColumns);

  if (isError) return null;

  return (
    <div className="flex w-full flex-1 flex-col items-start gap-2 self-stretch">
      <div className="flex flex-col items-start gap-4 self-stretch">
        <div className="flex flex-col items-start gap-4 self-stretch">
          <TableFiltersWithHeaderLabel />
          <TableViewContent
            key={'leads-table-container'}
            isLoading={isLoading}
            totalRecords={totalRecords}
            tableData={leadsData}
            columnHeaderData={resultantLeadsColumns as ColumnDefinition[]}
          />
        </div>
        <div className="flex items-center justify-end gap-4 self-stretch">
          {!isLoading && (
            <TablePagination
              totalPages={totalPages}
              totalItems={totalRecords}
              itemsPerPage={itemsPerPage}
              onItemsPerPageChange={handleItemsPerPageChange}
              handlePageChange={handlePageChange}
              currentPage={currentPage}
            />
          )}
        </div>
      </div>
    </div>
  );
};

const TableFiltersWithHeaderLabel = () => {
  return (
    <>
      {/* <p className="flex-1 text-2xl font-semibold text-gray-900">Table of leads</p> */}
      <div className="flex w-full items-start justify-between self-stretch">
        <AllFiltersContainer page={LEADS_PAGE} />
        <SortFilter page={LEADS_PAGE} key="Leads Sort" />
      </div>
    </>
  );
};

export default LeadsTableContainer;
