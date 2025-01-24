import React, { useEffect, useMemo } from 'react';
import { keepPreviousData } from '@tanstack/react-query';

import { useFormattedColumns } from '../hooks/useFormattedColumns';
import { usePagination } from '../hooks/usePagination.tsx';
import useConversationsTableQuery from '../queries/query/useConversationsTableQuery';

import SortFilter from './tableComp/SortFilter';
import TableViewContent from './TableViewContent';
import TableDataManager from '../managers/TableDataManager';
import TablePagination from './tableComp/TablePagination';
import AllFiltersContainer from './tableComp/AllFilters';

import { CONVERSATIONS_PAGE_COLUMN_LISTS } from '../utils/constants';
import {
  getSortingAppliedValues,
  getFormattedColumnsList,
  getMappedDataFromResponseForConversationsTableView,
  getAllFilterAppliedValues,
} from '../utils/common';

import { ColumnDefinition } from '@meaku/core/types/admin/admin-table';
import { ConversationsPayload } from '@meaku/core/types/admin/api';
import { ConversationsTableViewContent, ConversationsTableDisplayContent } from '@meaku/core/types/admin/admin';
import { useSortFilterStore } from '../stores/useSortFilterStore.ts';
import { useAllFilterStore } from '../stores/useAllFilterStore.ts';
import { CONVERSATIONS_PAGE } from '@meaku/core/utils/index';

type IProps = {
  tenantName: string;
};

const ConversationsTableContainer: React.FC<IProps> = ({ tenantName }) => {
  const { currentPage, itemsPerPage, handlePageChange, handleItemsPerPageChange } = usePagination({
    pageType: CONVERSATIONS_PAGE,
  });

  const sortState = useSortFilterStore((state) => state.conversations);
  const filterState = useAllFilterStore((state) => state.conversations);

  // Reset to page 1 when filters or sorting changes
  useEffect(() => {
    handlePageChange(1);
  }, [filterState]);

  const payloadData: ConversationsPayload = {
    filters: getAllFilterAppliedValues(filterState, CONVERSATIONS_PAGE),
    sort: getSortingAppliedValues(sortState, CONVERSATIONS_PAGE),
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
            key={'conversations-table-container'}
            isConversationTable={true}
            isLoading={isLoading}
            totalRecords={totalRecords}
            tableData={conversationsData}
            columnHeaderData={resultantConversationsColumns as ColumnDefinition[]}
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
      {/* <p className="flex-1 text-2xl font-semibold text-gray-900">Table of conversations</p> */}
      <div className="flex w-full items-start justify-between self-stretch">
        <AllFiltersContainer page={CONVERSATIONS_PAGE} />
        <SortFilter page={CONVERSATIONS_PAGE} key="Conversations Sort" />
      </div>
    </>
  );
};

export default ConversationsTableContainer;
