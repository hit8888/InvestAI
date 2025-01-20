import React from 'react';
import { ColumnDefinition } from '@meaku/core/types/admin/admin-table';
import CustomTableView from './tableComp/CustomTableView';
import Orb from '@breakout/design-system/components/Orb/index';
import { OrbStatusEnum } from '@meaku/core/types/config';

interface TableContentProps {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  tableData: any[];
  isConversationTable?: boolean;
  isLoading: boolean;
  totalRecords: number;
  columnHeaderData: ColumnDefinition[];
}

const TableViewContent: React.FC<TableContentProps> = ({
  isConversationTable = false,
  isLoading,
  totalRecords,
  tableData,
  columnHeaderData,
}) => {
  if (isLoading) {
    return (
      <div className="flex h-screen w-full animate-spin items-center justify-center">
        {/*Current Lavender (Good baseline for any theme color)*/}
        <Orb color="#E6E6FA" state={OrbStatusEnum.waiting} />
      </div>
    );
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
    />
  );
};

export default TableViewContent;
