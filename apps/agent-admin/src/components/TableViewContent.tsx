import React from 'react';
import { ColumnDefinition } from '@meaku/core/types/admin/admin-table';
import TableViewShimmer from './ShimmerComponent/TableViewShimmer';
import CommonTable from '@breakout/design-system/components/Table/CommonTable';
import { useSidebar } from '../context/SidebarContext';
import { PaginationPageType } from '@meaku/core/types/admin/admin';
interface TableContentProps {
  tableData: unknown[];
  isConversationTable?: boolean;
  isLoading: boolean;
  totalRecords: number;
  columnHeaderData: ColumnDefinition[];
  filterContainerHeight?: number;
  pageType: PaginationPageType;
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
}) => {
  const { isSidebarOpen } = useSidebar();
  if (isLoading) {
    return <TableViewShimmer columnCount={DEFAULT_LOADING_COLUMNS_COUNT} rowCount={DEFAULT_LOADING_ROW_COUNT} />;
  }

  if (!totalRecords) {
    return (
      <p className="w-full text-center text-2xl font-semibold text-gray-900">{`There are no ${isConversationTable ? 'conversations' : 'leads'} yet !!!`}</p>
    );
  }

  return (
    <CommonTable
      key={isConversationTable ? 'conversation-table-view' : 'leads-table-view'}
      tabularData={tableData}
      columnHeaderData={columnHeaderData}
      filterContainerHeight={filterContainerHeight}
      isSidebarOpen={isSidebarOpen}
      pageType={pageType}
    />
  );
};

export default TableViewContent;
