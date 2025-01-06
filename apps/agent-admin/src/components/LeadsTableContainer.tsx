import { useState } from 'react';
import { usePagination } from '../hooks/usePagination';
import { useSidebar } from '../context/SidebarContext';

import CustomTableView from './tableComp/CustomTableView';
import TablePagination from './tableComp/TablePagination';
import AllFilters from './tableComp/AllFilters';
import ExportDownload from './tableComp/ExportDownload';

import {
  DEFAULT_DATA_FOR_LEADS_PAGE,
  LEADS_PAGE_COLUMN_LISTS,
  PAGINATION_DEFAULT_ITEMS_PER_PAGE,
} from '../utils/constants';
import { getFormattedColumnsList } from '../utils/common';
import { ColumnDefinition } from '@meaku/core/types/admin/admin-table';
import { useFormattedColumns } from '../hooks/useFormattedColumns';
import SortFilter from './tableComp/SortFilter';

// import { useAuth } from '../context/AuthProvider';

const LeadsTableContainer = () => {
  // const { accessToken } = useAuth();
  const { isSidebarOpen } = useSidebar();
  const [leads] = useState(DEFAULT_DATA_FOR_LEADS_PAGE);

  const { paginatedData, currentPage, totalPages, itemsPerPage, handlePageChange, handleItemsPerPageChange } =
    usePagination({
      data: leads,
      initialItemsPerPage: PAGINATION_DEFAULT_ITEMS_PER_PAGE,
    });

  const leadsPageColumns: ColumnDefinition[] = getFormattedColumnsList(LEADS_PAGE_COLUMN_LISTS, 160);
  const resultantLeadsColumns = useFormattedColumns(leadsPageColumns);

  return (
    <div className="flex w-full flex-1 flex-col items-start gap-2 self-stretch">
      <div className="flex flex-col items-start gap-4 self-stretch">
        <div className="flex flex-col items-start gap-4 self-stretch">
          <TableFiltersWithHeaderLabel />
          <CustomTableView
            isSidebarOpen={isSidebarOpen}
            tabularData={paginatedData.length > 0 ? paginatedData : []}
            columnHeaderData={resultantLeadsColumns as ColumnDefinition[]}
          />
        </div>
        <div className="flex items-center justify-end gap-4 self-stretch">
          <TablePagination
            totalPages={totalPages}
            totalItems={leads.length}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={handleItemsPerPageChange}
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
