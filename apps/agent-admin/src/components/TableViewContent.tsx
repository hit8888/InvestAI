import React from 'react';
import { ColumnDefinition } from '@meaku/core/types/admin/admin-table';
import CustomTableView from './tableComp/CustomTableView';
import TableViewShimmer from './ShimmerComponent/TableViewShimmer';

interface TableContentProps {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  tableData: any[];
  isConversationTable?: boolean;
  isLoading: boolean;
  areAllFiltersApplied: boolean;
  totalRecords: number;
  columnHeaderData: ColumnDefinition[];
}

const DEFAULT_LOADING_ROW_COUNT = 10;
const DEFAULT_LOADING_COLUMNS_COUNT = 6;

const TableViewContent: React.FC<TableContentProps> = ({
  isConversationTable = false,
  isLoading,
  areAllFiltersApplied,
  totalRecords,
  tableData,
  columnHeaderData,
}) => {
  if (isLoading) {
    return <TableViewShimmer columnCount={DEFAULT_LOADING_COLUMNS_COUNT} rowCount={DEFAULT_LOADING_ROW_COUNT} />;
  }

  if (!totalRecords) {
    return (
      <p className="w-full text-center text-2xl font-semibold text-gray-900">{`There are No ${isConversationTable ? 'Conversations' : 'Leads'} Yet !!!`}</p>
    );
  }

  return (
    <CustomTableView
      key={isConversationTable ? 'conversation-table-view' : 'leads-table-view'}
      isConversationsPage={isConversationTable}
      tabularData={tableData?.length > 0 ? tableData : []}
      columnHeaderData={columnHeaderData}
      areAllFiltersApplied={areAllFiltersApplied}
    />
  );
};

export default TableViewContent;
