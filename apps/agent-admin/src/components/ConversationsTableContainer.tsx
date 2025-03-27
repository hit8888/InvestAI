import { useEffect, useMemo } from 'react';

import { useDebouncedValue } from '@meaku/core/hooks/useDebouncedValue';
import { useFormattedColumns } from '../hooks/useFormattedColumns';
import { usePagination } from '../hooks/usePagination.tsx';
import useConversationsTableQuery from '../queries/query/useConversationsTableQuery';

import TableViewContent from './TableViewContent';
import TableDataManager from '../managers/TableDataManager';
import TablePagination from './tableComp/TablePagination';
import TableFiltersWithHeaderLabel from './TableFiltersWithHeaderLabel.tsx';

import {
  CONVERSATIONS_PAGE_COLUMN_LISTS,
  PAGINATION_PER_PAGE_OPTIONS_FOR_CONVERSATIONS_TABLE,
} from '../utils/constants';
import {
  collectAppliedFilters,
  getAllFilterAppliedValues,
  getFormattedColumnsList,
  getMappedDataFromResponseForConversationsTableView,
  getSortingAppliedValues,
} from '../utils/common';

import { ColumnDefinition } from '@meaku/core/types/admin/admin-table';
import { ConversationsPayload } from '@meaku/core/types/admin/api';
import { ConversationsTableDisplayContent, ConversationsTableViewContent } from '@meaku/core/types/admin/admin';
import { useSortFilterStore } from '../stores/useSortFilterStore.ts';
import { useAllFilterStore } from '../stores/useAllFilterStore.ts';
import { CONVERSATIONS_PAGE } from '@meaku/core/utils/index';
import { useTableStore } from '../stores/useTableStore.ts';
import { useQueryOptions } from '../hooks/useQueryOptions.ts';
import { useInitializeFilterPreferences } from '../hooks/useInitializeFilterPreferences.tsx';
import { useEntityMetadata } from '../context/EntityMetadataContext.tsx';

const CONVERSATIONS_PAGE_NUMBER_OF_FILTERS: number = 3;

const ConversationsTableContainer = () => {
  const { transformedEntityMetadata } = useEntityMetadata();
  const { currentPage, itemsPerPage, handlePageChange, handleItemsPerPageChange } = usePagination({
    pageType: CONVERSATIONS_PAGE,
  });

  useInitializeFilterPreferences(CONVERSATIONS_PAGE);

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
  const queryOptions = useQueryOptions();

  const { data, isLoading, isError } = useConversationsTableQuery({
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

  const conversationsData: ConversationsTableDisplayContent[] = (tableManager?.getTableDataResults() ?? []).map(
    (item) => getMappedDataFromResponseForConversationsTableView(item as ConversationsTableViewContent),
  );
  const paginatedData = tableManager?.getPaginatedTableData() ?? { total_records: 0, total_pages: 1, page_size: 0 };
  const { page_size: pageSize, total_records: totalRecords, total_pages: totalPages } = paginatedData;

  const conversationsPageColumns: ColumnDefinition[] = getFormattedColumnsList(
    CONVERSATIONS_PAGE_COLUMN_LISTS,
    transformedEntityMetadata,
  );
  const resultantConversationsColumns = useFormattedColumns(conversationsPageColumns);

  if (isError) return null;

  const haveNoRecords = totalRecords === 0;
  const areAllFiltersApplied = allAppliedFilterValues.length === CONVERSATIONS_PAGE_NUMBER_OF_FILTERS;

  return (
    <div className="flex w-full flex-1 flex-col items-start gap-2 self-stretch">
      <div className="flex flex-col items-start gap-4 self-stretch">
        <div className="flex flex-col items-start self-stretch bg-white">
          <TableFiltersWithHeaderLabel
            isLoading={isLoading}
            payloadData={debouncedPayloadData}
            disabledState={haveNoRecords}
            key={CONVERSATIONS_PAGE}
            page={CONVERSATIONS_PAGE}
          />
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
          <TablePagination
            isLoading={isLoading}
            tableType={CONVERSATIONS_PAGE}
            paginationPerPageOptions={PAGINATION_PER_PAGE_OPTIONS_FOR_CONVERSATIONS_TABLE}
            totalPages={totalPages}
            totalItems={pageSize === 0 ? pageSize : totalRecords}
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

export default ConversationsTableContainer;
