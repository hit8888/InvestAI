import { flexRender, HeaderGroup } from '@tanstack/react-table';
import { ConversationsTableDisplayContent, LeadsTableDisplayContent } from '@meaku/core/types/admin/admin';
import { cn } from '@breakout/design-system/lib/cn';
import { useTablePinningStyles } from '../../hooks/useTablePinningStyles';
import { SHADOW_PINNED_COLUMNS } from '@meaku/core/utils/index';

type CustomSingleHeaderRowItemProps = {
  headerGroup: HeaderGroup<ConversationsTableDisplayContent | LeadsTableDisplayContent>;
};

// TODOS: NEED TO FIGURE OUT A WAY TO PERSIST the OVERFLOWING LAYER (bg-primary/20) for header background color
// Currently It is supporting hexcode of bg-primary/20 - #DCDAF8
const CustomSingleHeaderRowItem = ({ headerGroup }: CustomSingleHeaderRowItemProps) => {
  const { getCommonPinningStyles } = useTablePinningStyles();
  return (
    <tr key={headerGroup.id} className="relative flex w-full items-start">
      {headerGroup.headers.map((header) => {
        const isLastColumn = headerGroup.headers.indexOf(header) === headerGroup.headers.length - 1;
        const isShadowedColumn = SHADOW_PINNED_COLUMNS.includes(header.id);
        const isColumnNumberOfUserMessages = header.id === 'user_message_count';
        const isColumnProductOfInterest = header.id === 'product_of_interest';
        const isPinned = header.column.getIsPinned() === 'left';
        const isColumnPinnedLeftForName = isPinned && isShadowedColumn;
        return (
          <th
            key={header.id}
            colSpan={header.colSpan}
            className={cn(
              `relative flex flex-1 items-center gap-2 border-b border-t border-primary/40 bg-[#DCDAF8] p-2.5`,
              {
                'border-r': !isLastColumn,
                'w-28 truncate 2xl:w-40': isColumnProductOfInterest,
                'min-w-56': isColumnNumberOfUserMessages,
                pinnedColumnShadow: isColumnPinnedLeftForName,
              },
            )}
            style={{
              ...getCommonPinningStyles(header.column),
              backgroundColor: isPinned ? '#DCDAF8' : undefined,
            }}
          >
            <span className={cn(`flex-1 text-left text-xs font-medium text-gray-900`)}>
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
  );
};

export default CustomSingleHeaderRowItem;
