import { useState } from 'react';
import { cn } from '@breakout/design-system/lib/cn';

import ColumnSortIcon from '@breakout/design-system/components/icons/columnsort-icon';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';
import { ColumnDefinition } from '@meaku/core/types/admin/admin-table';
import { TABLE_SORT_ICON_PROPS } from '../../utils/constants';

interface TableViewProps {
  /* eslint-disable @typescript-eslint/no-explicit-any */
  tabularData: any[];
  columnHeaderData: ColumnDefinition[];
}

const CustomTableView = ({ tabularData, columnHeaderData }: TableViewProps) => {
  const [data] = useState(() => [...tabularData, ...tabularData, ...tabularData]);

  const table = useReactTable({
    data,
    columns: columnHeaderData,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full">
      <table className="flex w-full flex-col items-start self-stretch">
        <thead className="sticky top-0 z-10 w-full bg-primary/20">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="flex w-full items-start self-stretch">
              {headerGroup.headers.map((header) => {
                const isLastColumn = headerGroup.headers.indexOf(header) === headerGroup.headers.length - 1;
                const isColumnEmail = header.id === 'email';
                const isColumnProductOfInterest = header.id === 'productOfInterest';
                return (
                  <th
                    key={header.id}
                    className={cn(
                      `flex flex-1 items-center gap-2 border-b border-t border-primary/40 bg-primary/20 p-[10px]`,
                      {
                        'border-r': !isLastColumn,
                        'w-28 truncate 2xl:w-40': isColumnProductOfInterest,
                      },
                    )}
                  >
                    <span
                      className={cn(`text-left text-xs font-medium text-gray-900`, {
                        'w-40': isColumnEmail,
                        'flex-1': !isColumnEmail,
                      })}
                    >
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </span>
                    <span className="flex cursor-pointer items-start rounded-lg bg-primary/30 p-1">
                      <ColumnSortIcon {...TABLE_SORT_ICON_PROPS} color="#837EE7" />
                    </span>
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody className="max-h-96 w-full overflow-auto">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="flex w-full items-start self-stretch ">
              {row.getVisibleCells().map((cell) => {
                const isLastColumn = row.getVisibleCells().indexOf(cell) === row.getVisibleCells().length - 1;
                return (
                  <td
                    key={cell.id}
                    className={cn(
                      `flex flex-1 flex-col items-start justify-center gap-[10px] self-stretch border-b border-primary/20 bg-primary/2.5 p-2 `,
                      {
                        'border-r': !isLastColumn,
                      },
                    )}
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
