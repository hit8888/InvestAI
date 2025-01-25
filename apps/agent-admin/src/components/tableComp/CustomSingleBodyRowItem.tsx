import { flexRender, Row } from '@tanstack/react-table';
import { ConversationsTableDisplayContent, LeadsTableDisplayContent } from '@meaku/core/types/admin/admin';
import { cn } from '@breakout/design-system/lib/cn';
import { useTablePinningStyles } from '../../hooks/useTablePinningStyles';

type CustomSingleBodyRowItemProps = {
  row: Row<ConversationsTableDisplayContent | LeadsTableDisplayContent>;
  index: number;
  handleRowItemClick: (row: ConversationsTableDisplayContent) => void;
};

const CustomSingleBodyRowItem = ({ row, index, handleRowItemClick }: CustomSingleBodyRowItemProps) => {
  const { getCommonPinningStyles } = useTablePinningStyles();
  const detailsPageURL = 'session_id' in row.original ? row.original.session_id : null;

  return (
    <tr
      onClick={detailsPageURL ? () => handleRowItemClick(row.original as ConversationsTableDisplayContent) : undefined}
      key={row.id}
      className={cn('flex w-full items-start self-stretch', {
        'bg-white': index % 2 === 0, // White background for even rows
        'bg-gray-25': index % 2 !== 0, // Gray background for odd rows
        'cursor-pointer': detailsPageURL,
      })}
    >
      {row.getVisibleCells().map((cell) => {
        const isLastColumn = row.getVisibleCells().indexOf(cell) === row.getVisibleCells().length - 1;
        const isColumnNumberOfUserMessages = cell.column.id === 'number_of_user_messages';
        const isPinned = cell.column.getIsPinned() === 'left';
        const isColumnPinnedLeftForName = isPinned && cell.column.id === 'name';
        return (
          <td
            key={cell.id}
            className={cn(
              `border-gray/20 flex h-14 flex-1 flex-col items-start justify-center self-stretch border-b p-2 `,
              {
                'border-r': !isLastColumn,
                'min-w-56': isColumnNumberOfUserMessages,
                pinnedColumnShadow: isColumnPinnedLeftForName,
                'bg-white': isPinned && index % 2 === 0,
                'bg-gray-25': isPinned && index % 2 !== 0,
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

export default CustomSingleBodyRowItem;
