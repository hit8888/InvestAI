import { useState } from 'react';

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
    <div className="max-h-[400px] w-full overflow-auto">
      <table className="flex w-full flex-col items-start self-stretch">
        <thead className="sticky top-0 z-10 w-full">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="flex w-full items-start self-stretch">
              {headerGroup.headers.map((header) => {
                const isLastColumn = headerGroup.headers.indexOf(header) === headerGroup.headers.length - 1;
                const isColumnEmail = header.id === 'email';
                const isColumnProductOfInterest = header.id === 'productOfInterest';
                return (
                  <th
                    key={header.id}
                    className={`flex flex-1 gap-2 border-t p-[10px] ${isLastColumn ? '' : 'border-r'} ${isColumnProductOfInterest ? 'w-[115px] truncate 2xl:w-[158px]' : ''}  border-b border-[#B8B5F1] bg-[#DCDAF8]`}
                  >
                    <span
                      className={`text-left text-[#101828] ${isColumnEmail ? 'w-[158px]' : 'flex-1'} text-xs font-medium tracking-[0.12px]`}
                    >
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </span>
                    <span className="flex cursor-pointer items-start rounded-lg bg-[#CAC7F5] p-1">
                      <ColumnSortIcon {...TABLE_SORT_ICON_PROPS} color="#837EE7" />
                    </span>
                  </th>
                );
              })}
            </tr>
          ))}
        </thead>
        <tbody className="w-full">
          {table.getRowModel().rows.map((row) => (
            <tr key={row.id} className="flex w-full items-start self-stretch ">
              {row.getVisibleCells().map((cell) => {
                const isLastColumn = row.getVisibleCells().indexOf(cell) === row.getVisibleCells().length - 1;
                return (
                  <td
                    key={cell.id}
                    className={`flex flex-1 flex-col items-start justify-center gap-[10px] self-stretch p-2 ${isLastColumn ? '' : 'border-r'} border-b border-[#DCDAF8] bg-[#FBFBFE]`}
                  >
                    <p className={`flex items-center gap-2 self-stretch text-sm font-normal text-[#667085]`}>
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
