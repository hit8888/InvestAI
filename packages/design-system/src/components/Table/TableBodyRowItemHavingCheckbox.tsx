import { Cell, flexRender, Row } from '@tanstack/react-table';
import { CommonDataSourceResponse } from '@meaku/core/types/admin/admin';
import { cn } from '@breakout/design-system/lib/cn';
import { Checkbox } from '@breakout/design-system/components/Checkbox/index';
import { DOCUMENTS_PAGE } from '@meaku/core/utils/index';

type CustomSingleBodyRowItemProps = {
  row: Row<CommonDataSourceResponse>;
  index: number;
  isIdSelected: (id: number) => boolean;
  toggleSelectId: (id: number) => void;
  pageType: string;
};

const CellContent = ({ cell }: { cell: Cell<CommonDataSourceResponse, unknown> }) => {
  return (
    <div className="flex flex-1 items-center text-left text-sm text-gray-900">
      {cell.getIsPlaceholder() ? null : flexRender(cell.column.columnDef.cell, cell.getContext())}
    </div>
  );
};

type HeaderContentProps = {
  isFirstColumn: boolean;
  cell: Cell<CommonDataSourceResponse, unknown>;
  isRowSelected: boolean;
  toggleSelectId: (id: number) => void;
  pageType: string;
};

const RowCellContent = ({ isFirstColumn, cell, isRowSelected, toggleSelectId, pageType }: HeaderContentProps) => {
  const rowId = cell.row.original.id;

  if (isFirstColumn && pageType !== DOCUMENTS_PAGE) {
    return (
      <div className="flex items-start gap-4">
        <Checkbox
          checked={isRowSelected}
          className={`flex h-4 w-4 items-center justify-center rounded-sm border-gray-400 data-[state=checked]:border-none`}
          onCheckedChange={() => toggleSelectId(rowId)}
          haveBlackBackground={false}
        />
        <CellContent cell={cell} />
      </div>
    );
  }
  return <CellContent cell={cell} />;
};

const TableBodyRowItemHavingCheckbox = ({
  row,
  index,
  isIdSelected,
  toggleSelectId,
  pageType,
}: CustomSingleBodyRowItemProps) => {
  const isEvenRow = index % 2 === 0;
  const isOddRow = !isEvenRow;
  const isRowSelected = isIdSelected(row.original.id);

  return (
    <tr
      key={row.id}
      className={cn('flex w-full items-start self-stretch', {
        'bg-white': isEvenRow,
        'bg-gray-25': isOddRow,
        'bg-primary/5': isRowSelected,
      })}
    >
      {row.getVisibleCells().map((cell) => {
        const isFirstColumn = row.getVisibleCells().indexOf(cell) === 0;
        const isLastColumn = row.getVisibleCells().indexOf(cell) === row.getVisibleCells().length - 1;
        const isUrlColumn = cell.column.id === 'url';
        const isStatusColumn = cell.column.id === 'status';
        const isSourceNameColumn = cell.column.id === 'source_name';
        const isDataSourceTypeColumn = cell.column.id === 'data_source_type';
        return (
          <td
            key={cell.id}
            className={cn(
              `border-gray/20 flex h-14 min-w-72 flex-1 flex-col items-start justify-center self-stretch border-b border-r p-2`,
              {
                'border-l': isFirstColumn,
                'min-w-[600px]': isUrlColumn,
                'min-w-[500px]': isSourceNameColumn,
                'min-w-32': isLastColumn || isStatusColumn || isDataSourceTypeColumn,
              },
            )}
          >
            <RowCellContent
              toggleSelectId={toggleSelectId}
              isFirstColumn={isFirstColumn}
              cell={cell}
              isRowSelected={isRowSelected}
              pageType={pageType}
            />
          </td>
        );
      })}
    </tr>
  );
};

export default TableBodyRowItemHavingCheckbox;
