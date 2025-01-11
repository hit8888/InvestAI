import { useMemo } from 'react';
import { keepPreviousData } from '@tanstack/react-query';

import { useFormattedColumns } from '../hooks/useFormattedColumns';
import { usePagination } from '../hooks/usePagination';
import { useAuth } from '../context/AuthProvider';
import useLeadsTableQuery from '../queries/query/useLeadsTableQuery';

import SortFilter from './tableComp/SortFilter';
import TableViewContent from './TableViewContent';
import TableDataManager from '../managers/TableDataManager';
import TablePagination from './tableComp/TablePagination';
import AllFilters from './tableComp/AllFilters';
import ExportDownload from './tableComp/ExportDownload';

import { LEADS_PAGE_COLUMN_LISTS, PAGINATION_DEFAULT_ITEMS_PER_PAGE } from '../utils/constants';
import { getFormattedColumnsList, getMappedDataFromResponseForLeadsTableView } from '../utils/common';

import { ColumnDefinition } from '@meaku/core/types/admin/admin-table';
import { LeadsPayload } from '@meaku/core/types/admin/api';
import { LeadsTableDisplayContent, LeadsTableViewContent } from '@meaku/core/types/admin/admin';

const LeadsTableContainer = () => {
  const { getTenantIdentifier } = useAuth();
  const tenantName = getTenantIdentifier()?.['tenant-name'];

  const { currentPage, itemsPerPage, handlePageChange, handleItemsPerPageChange } = usePagination({
    initialItemsPerPage: PAGINATION_DEFAULT_ITEMS_PER_PAGE,
  });

  const payloadData: LeadsPayload = {
    filters: [],
    sort: [],
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
        <div className="flex items-start gap-4">
          <ExportDownload />
          <AllFilters />
        </div>
        <SortFilter />
      </div>
    </>
  );
};

export default LeadsTableContainer;
