import { CommonDataSourceResponse } from '@meaku/core/types/admin/admin';
import { Cell, flexRender } from '@tanstack/react-table';
import { memo } from 'react';
import { Checkbox } from '../Checkbox';
import { RowCellContentProps } from './tableTypes';
import { cn } from '../../lib/cn';

const CellContent = memo(
  ({
    cell,
    showItemAtCenter = true,
  }: {
    cell: Cell<CommonDataSourceResponse, unknown>;
    showItemAtCenter?: boolean;
  }) => {
    return (
      <div
        className={cn('flex h-full w-full items-center justify-start text-center text-sm text-gray-900', {
          'justify-center': showItemAtCenter,
        })}
      >
        {cell.getIsPlaceholder() ? null : flexRender(cell.column.columnDef.cell, cell.getContext())}
      </div>
    );
  },
);

CellContent.displayName = 'CellContent';

const RowCellContent = memo(
  ({ showActionItems, isFirstColumn, cell, isRowSelected, onToggleSelect }: RowCellContentProps) => {
    if (isFirstColumn && showActionItems) {
      return (
        <div className="flex w-full items-center gap-4">
          <Checkbox
            checked={isRowSelected}
            className={`flex h-4 w-4 items-center justify-center rounded-sm border-gray-400 data-[state=checked]:border-none`}
            onCheckedChange={onToggleSelect}
            onClick={(e) => e.stopPropagation()}
            haveBlackBackground={false}
          />
          <CellContent showItemAtCenter={false} cell={cell} />
        </div>
      );
    }
    return <CellContent cell={cell} />;
  },
);

RowCellContent.displayName = 'RowCellContent';

export default RowCellContent;
