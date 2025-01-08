import React from 'react';
import { ColumnDefinition } from '@meaku/core/types/admin/admin-table';
import CustomTableView from './tableComp/CustomTableView';

interface TableContentProps {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  tableData: any[];
  isConversationTable?: boolean;
  isLoading: boolean;
  totalRecords: number;
  columnHeaderData: ColumnDefinition[];
  isSidebarOpen: boolean;
}

const TableViewContent: React.FC<TableContentProps> = ({
  isConversationTable = false,
  isLoading,
  totalRecords,
  tableData,
  columnHeaderData,
  isSidebarOpen,
}) => {
  if (isLoading) {
    return <p className="w-full text-center text-lg font-semibold text-gray-900">Loading conversations...</p>;
  }

  if (!totalRecords) {
    return <p className="w-full text-center text-2xl font-semibold text-gray-900">No Data to Show</p>;
  }

  return (
    <CustomTableView
      isConversationsPage={isConversationTable}
      isSidebarOpen={isSidebarOpen}
      tabularData={tableData?.length > 0 ? tableData : []}
      columnHeaderData={columnHeaderData}
    />
  );
};

export default TableViewContent;
