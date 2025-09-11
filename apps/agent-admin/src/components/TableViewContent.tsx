import React from 'react';
import { ColumnDefinition } from '@meaku/core/types/admin/admin-table';
import TableViewShimmer from './ShimmerComponent/TableViewShimmer';
import CommonTable from '@breakout/design-system/components/Table/CommonTable';
import { useSidebar } from '../context/SidebarContext';
import { PaginationPageType } from '@meaku/core/types/admin/admin';
import { SortValues } from '@meaku/core/types/admin/sort';
import { useSortFilterStore } from '../stores/useSortFilterStore';
import NoDataFound from '@breakout/design-system/components/layout/NoDataFound';
import { useAllFilterStore } from '../stores/useAllFilterStore';
interface TableContentProps {
  tableData: unknown[];
  isConversationTable?: boolean;
  isLoading: boolean;
  totalRecords: number;
  columnHeaderData: ColumnDefinition[];
  filterContainerHeight?: number;
  pageType: PaginationPageType;
  onRowItemClick?: (rowData: unknown) => void;
}

const DEFAULT_LOADING_ROW_COUNT = 10;
const DEFAULT_LOADING_COLUMNS_COUNT = 6;

const TableViewContent: React.FC<TableContentProps> = ({
  isConversationTable = false,
  isLoading,
  totalRecords,
  tableData = [],
  columnHeaderData,
  filterContainerHeight = 0,
  pageType,
  onRowItemClick,
}) => {
  const { isSidebarOpen } = useSidebar();
  const { setSortValue } = useSortFilterStore();
  const sortValue = useSortFilterStore((state) => state[pageType] as SortValues);
  const filterState = useAllFilterStore((state) => state[pageType]);

  if (isLoading) {
    return <TableViewShimmer columnCount={DEFAULT_LOADING_COLUMNS_COUNT} rowCount={DEFAULT_LOADING_ROW_COUNT} />;
  }

  if (!totalRecords && filterState.searchTableContent) {
    return (
      <div className="flex w-full items-center justify-center gap-2 p-10 text-2xl font-medium text-gray-500">
        <span>No results found for </span>
        <span className="text-primary">"{filterState.searchTableContent}"</span>
        <span>- Try adjusting your search terms</span>
      </div>
    );
  }

  if (!totalRecords) {
    const title = isConversationTable ? 'No conversations yet' : 'Waiting for activity';
    const description = isConversationTable
      ? 'No interactions or conversations from website visitors yet, Time to get more traffic.'
      : 'No leads generated from website visitor conversations yet, Time to get more leads.';
    return <NoDataFound className="min-h-[60vh]" title={title} description={description} />;
  }

  return (
    <CommonTable
      key={isConversationTable ? 'conversation-table-view' : 'leads-table-view'}
      tabularData={tableData}
      columnHeaderData={columnHeaderData}
      filterContainerHeight={filterContainerHeight}
      isSidebarOpen={isSidebarOpen}
      pageType={pageType}
      onRowItemClick={onRowItemClick}
      setSortValue={setSortValue}
      sortValue={sortValue}
    />
  );
};

export default TableViewContent;
