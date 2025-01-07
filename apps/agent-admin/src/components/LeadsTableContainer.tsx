import { useEffect, useState } from 'react';
import { usePagination } from '../hooks/usePagination';
import { useSidebar } from '../context/SidebarContext';

import { useAuth } from '../context/AuthProvider';
import useLeadsTableAPI from '../../../../packages/core/src/queries/mutation/admin/useLeadsTableAPI';
import { APIHeaders, LeadsTableResponse } from '@meaku/core/types/admin/api';

import CustomTableView from './tableComp/CustomTableView';
import TablePagination from './tableComp/TablePagination';
import AllFilters from './tableComp/AllFilters';
import ExportDownload from './tableComp/ExportDownload';

import {
  DEFAULT_DATA_FOR_LEADS_PAGE,
  LEADS_PAGE_COLUMN_LISTS,
  PAGINATION_DEFAULT_ITEMS_PER_PAGE,
} from '../utils/constants';
import { getFormattedColumnsList, getMappedDataFromResponse } from '../utils/common';
import { ColumnDefinition } from '@meaku/core/types/admin/admin-table';
import { useFormattedColumns } from '../hooks/useFormattedColumns';
import SortFilter from './tableComp/SortFilter';

const LeadsTableContainer = () => {
  const { accessToken, getTenantIdentifier } = useAuth();
  const { isSidebarOpen } = useSidebar();
  const [totalRecords, setTotalRecords] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [leads, setLeads] = useState(DEFAULT_DATA_FOR_LEADS_PAGE);

  const {
    currentPage,
    itemsPerPage,
    handlePageChange,
    // handleItemsPerPageChange
  } = usePagination({
    totalPages,
    initialItemsPerPage: PAGINATION_DEFAULT_ITEMS_PER_PAGE,
  });

  const leadsPageColumns: ColumnDefinition[] = getFormattedColumnsList(LEADS_PAGE_COLUMN_LISTS, 160);
  const resultantLeadsColumns = useFormattedColumns(leadsPageColumns);

  const tenantName = getTenantIdentifier()?.['tenant-name'];

  const headers: APIHeaders = {
    'x-tenant-name': tenantName || '',
    'Content-Type': 'application/json',
    Authorization: `Bearer ${accessToken}`,
  };

  const { mutateAsync: getLeadsRowData } = useLeadsTableAPI(headers);

  useEffect(() => {
    const payloadData = {
      filters: [],
      sort: [],
      search: '',
      page: currentPage,
    };
    const getLeads = async () => {
      try {
        if (tenantName) {
          const response = await getLeadsRowData(payloadData);
          const data: LeadsTableResponse = response.data;
          /* eslint-disable @typescript-eslint/no-explicit-any */
          const updatedData = data?.results?.map((item: any) => getMappedDataFromResponse(item));
          if (currentPage === 1) {
            setTotalRecords(data?.total_records);
            setTotalPages(data?.total_pages);
          }
          setLeads(updatedData);
        } else {
          console.error('Tenant name is undefined');
        }
      } catch (error) {
        console.error('Failed to load leads:', error);
      }
    };

    getLeads();
  }, [currentPage]);

  return (
    <div className="flex w-full flex-1 flex-col items-start gap-2 self-stretch">
      <div className="flex flex-col items-start gap-4 self-stretch">
        <div className="flex flex-col items-start gap-4 self-stretch">
          <TableFiltersWithHeaderLabel />
          <CustomTableView
            isSidebarOpen={isSidebarOpen}
            tabularData={leads?.length > 0 ? leads : []}
            columnHeaderData={resultantLeadsColumns as ColumnDefinition[]}
          />
        </div>
        <div className="flex items-center justify-end gap-4 self-stretch">
          <TablePagination
            totalPages={totalPages}
            totalItems={totalRecords}
            itemsPerPage={itemsPerPage}
            // onItemsPerPageChange={handleItemsPerPageChange}
            handlePageChange={handlePageChange}
            currentPage={currentPage}
          />
        </div>
      </div>
    </div>
  );
};

const TableFiltersWithHeaderLabel = () => {
  return (
    <>
      <p className="flex-1 text-2xl font-semibold text-gray-900">Table of leads</p>
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
