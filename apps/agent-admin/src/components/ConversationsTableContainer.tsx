import { useState } from 'react';
import { useSidebar } from '../context/SidebarContext';
import { usePagination } from '../hooks/usePagination';

import CustomTableView from './tableComp/CustomTableView';
import TablePagination from './tableComp/TablePagination';
import AllFilters from './tableComp/AllFilters';

import {
  CONVERSATIONS_PAGE_COLUMN_LISTS,
  DEFAULT_DATA_FOR_CONVERSATIONS_PAGE,
  PAGINATION_DEFAULT_ITEMS_PER_PAGE,
} from '../utils/constants';
import { getFormattedColumnsList } from '../utils/common';
import { ColumnDefinition } from '@meaku/core/types/admin/admin-table';
import { useFormattedColumns } from '../hooks/useFormattedColumns';
import SortFilter from './tableComp/SortFilter';

// import { useAuth } from '../context/AuthProvider';

const ConversationsTableContainer = () => {
  // const { accessToken } = useAuth();
  const { isSidebarOpen } = useSidebar();
  const [conversations] = useState(DEFAULT_DATA_FOR_CONVERSATIONS_PAGE);

  const { paginatedData, currentPage, totalPages, itemsPerPage, handlePageChange, handleItemsPerPageChange } =
    usePagination({
      data: conversations,
      initialItemsPerPage: PAGINATION_DEFAULT_ITEMS_PER_PAGE,
    });

  const conversationsPageColumns: ColumnDefinition[] = getFormattedColumnsList(CONVERSATIONS_PAGE_COLUMN_LISTS, 200);
  const resultantConversationsColumns = useFormattedColumns(conversationsPageColumns);

  return (
    <div className="flex w-full flex-1 flex-col items-start gap-2 self-stretch">
      <div className="flex flex-col items-start gap-4 self-stretch">
        <div className="flex flex-col items-start gap-4 self-stretch">
          <TableFiltersWithHeaderLabel />
          <CustomTableView
            isConversationsPage={true}
            isSidebarOpen={isSidebarOpen}
            tabularData={paginatedData.length > 0 ? paginatedData : []}
            columnHeaderData={resultantConversationsColumns as ColumnDefinition[]}
          />
        </div>
        <div className="flex items-center justify-end gap-4 self-stretch">
          <TablePagination
            totalPages={totalPages}
            totalItems={conversations.length}
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
        <AllFilters />
        <SortFilter />
      </div>
    </>
  );
};

export default ConversationsTableContainer;
