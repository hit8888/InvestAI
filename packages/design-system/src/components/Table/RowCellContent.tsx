import { CommonDataSourceResponse } from '@meaku/core/types/admin/admin';
import { Cell, flexRender } from '@tanstack/react-table';
import { memo } from 'react';
import { Checkbox } from '../Checkbox';
import { RowCellContentProps } from './tableTypes';

const CellContent = memo(({ cell }: { cell: Cell<CommonDataSourceResponse, unknown> }) => {
  return (
    <div className="flex h-full w-full items-center text-left text-sm text-gray-900">
      {cell.getIsPlaceholder() ? null : flexRender(cell.column.columnDef.cell, cell.getContext())}
    </div>
  );
});

CellContent.displayName = 'CellContent';

const RowCellContent = memo(({ isFirstColumn, cell, isRowSelected, onToggleSelect }: RowCellContentProps) => {
  if (isFirstColumn) {
    return (
      <div className="flex w-full items-center gap-4">
        <Checkbox
          checked={isRowSelected}
          className={`flex h-4 w-4 items-center justify-center rounded-sm border-gray-400 data-[state=checked]:border-none`}
          onCheckedChange={onToggleSelect}
          onClick={(e) => e.stopPropagation()}
          haveBlackBackground={false}
        />
        <CellContent cell={cell} />
      </div>
    );
  }
  return <CellContent cell={cell} />;
});

RowCellContent.displayName = 'RowCellContent';

export default RowCellContent;
