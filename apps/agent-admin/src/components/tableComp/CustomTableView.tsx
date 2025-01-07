import { CSSProperties, useEffect, useState } from 'react';
import { cn } from '@breakout/design-system/lib/cn';

import ColumnSortIcon from '@breakout/design-system/components/icons/columnsort-icon';
import { flexRender, getCoreRowModel, useReactTable, Column } from '@tanstack/react-table';
import { ColumnDefinition, ConversationsTableViewProps } from '@meaku/core/types/admin/admin-table';
import { CONVERSATIONS_PINNED_COLUMNS, TABLE_SORT_ICON_PROPS } from '../../utils/constants';

interface TableViewProps {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  tabularData: any[];
  columnHeaderData: ColumnDefinition[];
  isConversationsPage?: boolean;
  isSidebarOpen?: boolean;
}

const CustomTableView = ({
  tabularData,
  columnHeaderData,
  isConversationsPage = false,
  isSidebarOpen,
}: TableViewProps) => {
  const [data, setData] = useState(tabularData);

  useEffect(() => {
    setData(tabularData);
  }, [tabularData]);

  const table = useReactTable({
    initialState: {
      columnPinning: {
        left: isConversationsPage ? CONVERSATIONS_PINNED_COLUMNS : [],
      },
    },
    data,
    columns: columnHeaderData,
    getCoreRowModel: getCoreRowModel(),
  });

  const getCommonPinningStyles = (column: Column<ConversationsTableViewProps>): CSSProperties => {
    const isPinned = column.getIsPinned();
    return {
      left: isPinned === 'left' ? `${column.getStart('left')}px` : undefined,
      // right: isPinned === 'right' ? `${column.getAfter('right')}px` : undefined,
      opacity: isPinned ? 0.95 : 1,
      position: isPinned ? 'sticky' : 'relative',
      width: column.getSize(),
      zIndex: isPinned ? 1 : 0,
    };
  };

  // TODOS: WHEN using cn - vertical scroll gets affected
  return (
    <div
      className={`w-full ${isSidebarOpen ? 'max-w-[1200px] 2xl:max-w-[1600px]' : 'max-w-[1400px] 2xl:max-w-[1800px]'}  relative max-h-96 overflow-hidden overflow-x-scroll overflow-y-scroll`}
    >
      <table
        style={{
          width: isConversationsPage ? table.getTotalSize() : '100%',
        }}
      >
        <thead className="sticky top-0 z-10 w-full">
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
                    <span className="flex cursor-pointer items-start rounded-lg bg-primary/30 p-1">
                      <ColumnSortIcon {...TABLE_SORT_ICON_PROPS} color="rgb(var(--primary/700))" />
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
        <tbody>
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="flex w-full items-start self-stretch ">
              {row.getVisibleCells().map((cell) => {
                const isLastColumn = row.getVisibleCells().indexOf(cell) === row.getVisibleCells().length - 1;
                const isColumnNumberOfUserMessages = cell.column.id === 'number_of_user_messages';
                const isColumnPinnedLeftForName = cell.column.getIsPinned() === 'left' && cell.column.id === 'name';
                return (
                  <td
                    key={cell.id}
                    className={cn(
                      `flex flex-1 flex-col items-start justify-center self-stretch border-b border-primary/20 bg-primary/2.5 p-2 `,
                      {
                        'border-r': !isLastColumn,
                        'min-w-56': isColumnNumberOfUserMessages,
                        pinnedColumnShadow: isColumnPinnedLeftForName,
                      },
                    )}
                    style={{ ...getCommonPinningStyles(cell.column) }}
                  >
                    <p className={`flex items-center gap-2 self-stretch text-sm font-normal text-gray-500`}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
                    </p>
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CustomTableView;
