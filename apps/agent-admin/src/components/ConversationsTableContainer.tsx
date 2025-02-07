import React, { useEffect, useMemo } from 'react';
import { keepPreviousData } from '@tanstack/react-query';

import { useDebouncedValue } from '@meaku/core/hooks/useDebouncedValue';
import { useFormattedColumns } from '../hooks/useFormattedColumns';
import { usePagination } from '../hooks/usePagination.tsx';
import useConversationsTableQuery from '../queries/query/useConversationsTableQuery';

import TableViewContent from './TableViewContent';
import TableDataManager from '../managers/TableDataManager';
import TablePagination from './tableComp/TablePagination';
import TableFiltersWithHeaderLabel from './TableFiltersWithHeaderLabel.tsx';

import { CONVERSATIONS_PAGE_COLUMN_LISTS } from '../utils/constants';
import {
  getSortingAppliedValues,
  getFormattedColumnsList,
  getMappedDataFromResponseForConversationsTableView,
  getAllFilterAppliedValues,
  collectAppliedFilters,
} from '../utils/common';

import { ColumnDefinition } from '@meaku/core/types/admin/admin-table';
import { ConversationsPayload } from '@meaku/core/types/admin/api';
import { ConversationsTableViewContent, ConversationsTableDisplayContent } from '@meaku/core/types/admin/admin';
import { useSortFilterStore } from '../stores/useSortFilterStore.ts';
import { useAllFilterStore } from '../stores/useAllFilterStore.ts';
import { CONVERSATIONS_PAGE } from '@meaku/core/utils/index';
import { useTableStore } from '../stores/useTableStore.ts';

const CONVERSATIONS_PAGE_NUMBER_OF_FILTERS: number = 3;

type IProps = {
  tenantName: string;
};

const ConversationsTableContainer: React.FC<IProps> = ({ tenantName }) => {
  const { currentPage, itemsPerPage, handlePageChange, handleItemsPerPageChange } = usePagination({
    pageType: CONVERSATIONS_PAGE,
  });

  const sortState = useSortFilterStore((state) => state.conversations);
  const filterState = useAllFilterStore((state) => state.conversations);

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
    };
  }, [allAppliedFilterValues, sortState, currentPage, itemsPerPage]);

  // Use debounced payload to prevent excessive API calls
  const debouncedPayloadData = useDebouncedValue(payloadData);

  const { data, isLoading, isError } = useConversationsTableQuery({
    payload: debouncedPayloadData,
    tenantName: tenantName || '',
    queryOptions: {
      enabled: !!tenantName,
      placeholderData: keepPreviousData,
    },
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

  const conversationsData: ConversationsTableDisplayContent[] = (tableManager?.getTableDataResults() ?? []).map(
    (item) => getMappedDataFromResponseForConversationsTableView(item as ConversationsTableViewContent),
  );
  const paginatedData = tableManager?.getPaginatedTableData() ?? { total_records: 0, total_pages: 1, page_size: 0 };
  const { page_size: pageSize, total_records: totalRecords, total_pages: totalPages } = paginatedData;

  const conversationsPageColumns: ColumnDefinition[] = getFormattedColumnsList(CONVERSATIONS_PAGE_COLUMN_LISTS, 200);
  const resultantConversationsColumns = useFormattedColumns(conversationsPageColumns);

  if (isError) return null;

  const areAllFiltersApplied = allAppliedFilterValues.length === CONVERSATIONS_PAGE_NUMBER_OF_FILTERS;

  return (
    <div className="flex w-full flex-1 flex-col items-start gap-2 self-stretch">
      <div className="flex flex-col items-start gap-4 self-stretch">
        <div className="flex flex-col items-start self-stretch bg-white">
          <TableFiltersWithHeaderLabel key={CONVERSATIONS_PAGE} page={CONVERSATIONS_PAGE} />
          <TableViewContent
            key={'conversations-table-container'}
            isConversationTable={true}
            isLoading={isLoading}
            areAllFiltersApplied={areAllFiltersApplied}
            totalRecords={totalRecords}
            tableData={conversationsData}
            columnHeaderData={resultantConversationsColumns as ColumnDefinition[]}
          />
        </div>
        <div className="flex items-center justify-end gap-4 self-stretch">
          {!isLoading && (
            <TablePagination
              totalPages={totalPages}
              totalItems={pageSize === 0 ? pageSize : totalRecords}
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

export default ConversationsTableContainer;
