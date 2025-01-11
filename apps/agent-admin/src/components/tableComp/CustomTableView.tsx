import { CSSProperties, useEffect, useState } from 'react';
import { cn } from '@breakout/design-system/lib/cn';

import { Column, flexRender, useReactTable, getCoreRowModel, Row } from '@tanstack/react-table';
import { ColumnDefinition } from '@meaku/core/types/admin/admin-table';
import { CONVERSATIONS_PINNED_COLUMNS } from '../../utils/constants';
import { LeadsTableDisplayContent, ConversationsTableDisplayContent } from '@meaku/core/types/admin/admin';
import { useNavigate } from 'react-router-dom';
// import { useConversationDetails } from '../../context/ConversationDetailsContext';
import { useSidebar } from '../../context/SidebarContext';

interface TableViewProps {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  tabularData: any[];
  columnHeaderData: ColumnDefinition[];
  isConversationsPage?: boolean;
}

const CustomTableView = ({ tabularData, columnHeaderData, isConversationsPage = false }: TableViewProps) => {
  const navigate = useNavigate();
  const { isSidebarOpen } = useSidebar();
  // const { handleSetConversationDetails } = useConversationDetails();
  const [data, setData] = useState(tabularData);

  useEffect(() => {
    setData(tabularData);
  }, [tabularData]);

  const table = useReactTable({
    initialState: {
      columnPinning: {
        // left: isConversationsPage ? CONVERSATIONS_PINNED_COLUMNS : [],
        left: CONVERSATIONS_PINNED_COLUMNS,
      },
    },
    data,
    columns: columnHeaderData,
    getCoreRowModel: getCoreRowModel(),
  });

  const getCommonPinningStyles = (
    column: Column<ConversationsTableDisplayContent | LeadsTableDisplayContent>,
  ): CSSProperties => {
    const isPinned = column.getIsPinned();
    return {
      left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
      // right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
      opacity: isPinned ? 0.95 : 1,
      position: isPinned ? 'sticky' : 'relative',
      width: column.getSize(),
      zIndex: isPinned ? 100 : 0,
    };
  };

  const handleRowItemClick = (row: ConversationsTableDisplayContent) => {
    const detailsPageURL = row.session_id;
    // handleSetConversationDetails(row as ConversationsTableDisplayContent);
    navigate(`${detailsPageURL}`);
  };

  const getSingleRowItem = (row: Row<ConversationsTableDisplayContent | LeadsTableDisplayContent>, index: number) => {
    const detailsPageURL = 'session_id' in row.original ? row.original.session_id : null;
    return (
      <tr
        onClick={
          detailsPageURL ? () => handleRowItemClick(row.original as ConversationsTableDisplayContent) : undefined
        }
        key={row.id}
        className={cn('flex w-full items-start self-stretch bg-gray-600', {
          'bg-white': index % 2 === 0, // White background for even rows
          'bg-gray-25': index % 2 !== 0, // Gray background for odd rows
          'cursor-pointer': detailsPageURL,
        })}
      >
        {row.getVisibleCells().map((cell) => {
          const isLastColumn = row.getVisibleCells().indexOf(cell) === row.getVisibleCells().length - 1;
          const isColumnNumberOfUserMessages = cell.column.id === 'number_of_user_messages';
          const isColumnPinnedLeftForName = cell.column.getIsPinned() === 'left' && cell.column.id === 'name';
          return (
            <td
              key={cell.id}
              className={cn(
                `border-gray/20 flex flex-1 flex-col items-start justify-center self-stretch border-b p-2 `,
                {
                  'border-r': !isLastColumn,
                  'min-w-56': isColumnNumberOfUserMessages,
                  pinnedColumnShadow: isColumnPinnedLeftForName,
                },
              )}
              style={{ ...getCommonPinningStyles(cell.column) }}
            >
              <div className={`flex items-center gap-2 self-stretch text-sm font-normal text-gray-500`}>
                {flexRender(cell.column.columnDef.cell, cell.getContext())}
              </div>
            </td>
          );
        })}
      </tr>
    );
  };

  return (
    <div
      className={`w-full ${isSidebarOpen ? 'max-w-[1200px] 2xl:max-w-[1600px]' : 'max-w-[1400px] 2xl:max-w-[1800px]'}  relative overflow-x-auto`}
    >
      <table
        style={{
          width: isConversationsPage ? table.getTotalSize() : '100%',
        }}
      >
        <thead>
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="flex w-full items-start">
              {headerGroup.headers.map((header) => {
                const isLastColumn = headerGroup.headers.indexOf(header) === headerGroup.headers.length - 1;
                const isColumnName = header.id === 'name';
                const isColumnNumberOfUserMessages = header.id === 'number_of_user_messages';
                const isColumnProductOfInterest = header.id === 'product_of_interest';
                const isColumnPinnedLeftForName = header.column.getIsPinned() === 'left' && isColumnName;
                return (
                  <th
                    key={header.id}
                    colSpan={header.colSpan}
                    className={cn(
                      `relative flex flex-1 items-center gap-2 border-b border-t border-primary/40 bg-primary/20 p-2.5`,
                      {
                        'border-r': !isLastColumn,
                        'w-28 truncate 2xl:w-40': isColumnProductOfInterest,
                        'min-w-56': isColumnNumberOfUserMessages,
                        pinnedColumnShadow: isColumnPinnedLeftForName,
                      },
                    )}
                    style={{ ...getCommonPinningStyles(header.column) }}
                  >
                    <span className={cn(`flex-1 text-left text-xs font-medium text-gray-900`, {})}>
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </span>
                    <div
                      {...{
                        onDoubleClick: () => header.column.resetSize(),
                        onMouseDown: header.getResizeHandler(),
                        onTouchStart: header.getResizeHandler(),
                        className: `resizer ${header.column.getIsResizing() ? 'isResizing' : ''}`,
                      }}
                    />
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody>{table.getRowModel().rows.map((row, index) => getSingleRowItem(row, index))}</tbody>
      </table>
    </div>
  );
};

export default CustomTableView;
