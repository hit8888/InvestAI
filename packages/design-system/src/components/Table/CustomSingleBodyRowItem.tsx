import { flexRender, Row } from '@tanstack/react-table';
import {
  ConversationsTableDisplayContent,
  LeadsTableDisplayContent,
  VisitorsTableDisplayContent,
} from '@neuraltrade/core/types/admin/admin';
import { cn } from '@breakout/design-system/lib/cn';
import AccessibleTableRow from '../accessibility/AccessibleTableRow';
import { useTablePinningStyles } from '../../hooks/useTablePinningStyles';
import { SHADOW_PINNED_COLUMNS } from '@neuraltrade/core/utils/index';

type CustomSingleBodyRowItemProps = {
  row: Row<ConversationsTableDisplayContent | LeadsTableDisplayContent | VisitorsTableDisplayContent>;
  handleRowItemClick: (
    row: ConversationsTableDisplayContent | LeadsTableDisplayContent | VisitorsTableDisplayContent,
  ) => void;
};

const CustomSingleBodyRowItem = ({ row, handleRowItemClick }: CustomSingleBodyRowItemProps) => {
  const { getCommonPinningStyles } = useTablePinningStyles();
  const detailsPageURL = 'session_id' in row.original ? row.original.session_id : null;

  const handleSingleRowItemClick = () => {
    if (detailsPageURL) {
      handleRowItemClick(
        row.original as ConversationsTableDisplayContent | LeadsTableDisplayContent | VisitorsTableDisplayContent,
      );
    }
  };
  return (
    <AccessibleTableRow
      onClick={handleSingleRowItemClick}
      clickable={!!detailsPageURL}
      key={row.id}
      className={cn('flex w-full items-start self-stretch bg-white')}
    >
      {row.getVisibleCells().map((cell) => {
        const isLastColumn = row.getVisibleCells().indexOf(cell) === row.getVisibleCells().length - 1;
        const isColumnNumberOfUserMessages = cell.column.id === 'user_message_count';
        const isBuyerIntentColumn = ['buyer_intent_score', 'buyer_intent'].includes(cell.column.id);
        const isPinned = cell.column.getIsPinned() === 'left';
        const isShadowedColumn = SHADOW_PINNED_COLUMNS.includes(cell.column.id);
        const isColumnPinnedLeftForName = isPinned && isShadowedColumn;
        return (
          <td
            key={cell.id}
            className={cn(`border-gray/20 flex flex-1 flex-col items-start border-b px-2 py-3`, {
              'border-r': !isLastColumn,
              'min-w-56': isColumnNumberOfUserMessages,
              pinnedColumnShadow: isColumnPinnedLeftForName,
            })}
            style={{ ...getCommonPinningStyles(cell.column) }}
          >
            <div
              className={cn(`flex items-center gap-2 self-stretch text-sm font-normal text-gray-900`, {
                'relative py-2.5': isBuyerIntentColumn,
              })}
            >
              {flexRender(cell.column.columnDef.cell, cell.getContext())}
            </div>
          </td>
        );
      })}
    </AccessibleTableRow>
  );
};

export default CustomSingleBodyRowItem;
