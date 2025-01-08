import { useMemo } from 'react';
import { keepPreviousData } from '@tanstack/react-query';

import { useFormattedColumns } from '../hooks/useFormattedColumns';
import { useSidebar } from '../context/SidebarContext';
import { usePagination } from '../hooks/usePagination';
import { useAuth } from '../context/AuthProvider';
import useConversationsTableQuery from '../queries/query/useConversationsTableQuery';

import SortFilter from './tableComp/SortFilter';
import TableViewContent from './TableViewContent';
import TableDataManager from '../managers/TableDataManager';
import TablePagination from './tableComp/TablePagination';
import AllFilters from './tableComp/AllFilters';

import { CONVERSATIONS_PAGE_COLUMN_LISTS, PAGINATION_DEFAULT_ITEMS_PER_PAGE } from '../utils/constants';
import { getFormattedColumnsList, getMappedDataFromResponseForConversationsTableView } from '../utils/common';

import { ColumnDefinition } from '@meaku/core/types/admin/admin-table';
import { ConversationsPayload } from '@meaku/core/types/admin/api';
import { ConversationsTableViewContent, ConversationsTableDisplayContent } from '@meaku/core/types/admin/admin';

const ConversationsTableContainer = () => {
  const { getTenantIdentifier } = useAuth();
  const { isSidebarOpen } = useSidebar();

  const tenantName = getTenantIdentifier()?.['tenant-name'];

  const { currentPage, itemsPerPage, handlePageChange, handleItemsPerPageChange } = usePagination({
    initialItemsPerPage: PAGINATION_DEFAULT_ITEMS_PER_PAGE,
  });

  const payloadData: ConversationsPayload = {
    filters: [],
    sort: [
      {
        field: 'timestamp',
        order: 'desc',
      },
    ],
    page: currentPage,
    page_size: itemsPerPage,
  };

  const { data, isLoading, isError } = useConversationsTableQuery({
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

  const conversationsData: ConversationsTableDisplayContent[] = (tableManager?.getTableDataResults() ?? []).map(
    (item) => getMappedDataFromResponseForConversationsTableView(item as ConversationsTableViewContent),
  );
  const paginatedData = tableManager?.getPaginatedTableData() ?? { total_records: 0, total_pages: 1 };
  const { total_records: totalRecords, total_pages: totalPages } = paginatedData;

  const conversationsPageColumns: ColumnDefinition[] = getFormattedColumnsList(CONVERSATIONS_PAGE_COLUMN_LISTS, 200);
  const resultantConversationsColumns = useFormattedColumns(conversationsPageColumns);

  if (isError) return null;

  return (
    <div className="flex w-full flex-1 flex-col items-start gap-2 self-stretch">
      <div className="flex flex-col items-start gap-4 self-stretch">
        <div className="flex flex-col items-start gap-4 self-stretch">
          <TableFiltersWithHeaderLabel />
          <TableViewContent
            isConversationTable={true}
            isLoading={isLoading}
            totalRecords={totalRecords}
            tableData={conversationsData}
            columnHeaderData={resultantConversationsColumns as ColumnDefinition[]}
            isSidebarOpen={isSidebarOpen}
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
      <p className="flex-1 text-2xl font-semibold text-gray-900">Table of conversations</p>
      <div className="flex w-full items-start justify-between self-stretch">
        <AllFilters />
        <SortFilter />
      </div>
    </>
  );
};

export default ConversationsTableContainer;
