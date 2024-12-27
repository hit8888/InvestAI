import React from 'react';

import ColumnSortIcon from '@breakout/design-system/components/icons/columnsort-icon';
import { LeadsTableViewProps } from '@meaku/core/types/admintable';
import { flexRender, getCoreRowModel, useReactTable } from '@tanstack/react-table';

type TableViewProps = {
  tabularData: LeadsTableViewProps[];
  /* eslint-disable @typescript-eslint/no-explicit-any */
  columnHeaderData: any; // NEED TO ADD TYPE
};

const CustomTableView = ({ tabularData, columnHeaderData }: TableViewProps) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [data, _setData] = React.useState(() => [...tabularData]);

  const table = useReactTable({
    data,
    columns: columnHeaderData,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div className="w-full">
      <table className="flex w-[1573px] flex-col items-start self-stretch">
        <thead className="w-full">
          {table.getHeaderGroups().map((headerGroup) => (
            <tr key={headerGroup.id} className="flex w-full items-start self-stretch ">
              {headerGroup.headers.map((header) => {
                const isLastColumn = headerGroup.headers.indexOf(header) === headerGroup.headers.length - 1;
                const isColumnEmail = header.id === 'email';
                return (
                  <th
                    key={header.id}
                    className={`flex flex-1 gap-2 border-t p-[10px] ${isLastColumn ? '' : 'border-r'}  border-b border-[#B8B5F1] bg-[#DCDAF8]`}
                  >
                    <span
                      className={`text-left text-[#101828] ${isColumnEmail ? 'w-[158px]' : 'flex-1'} font-inter text-[12px] font-medium leading-[18px] tracking-[0.12px]`}
                    >
                      {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
                    </span>
                    <ColumnSortIcon />
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
                    <p
                      className={`flex items-center gap-2 self-stretch font-inter text-[14px] font-normal leading-[20px] text-[#667085]`}
                    >
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
