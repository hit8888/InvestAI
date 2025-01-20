import { flexRender, HeaderGroup } from '@tanstack/react-table';
import { ConversationsTableDisplayContent, LeadsTableDisplayContent } from '@meaku/core/types/admin/admin';
import { cn } from '@breakout/design-system/lib/cn';
import { useTablePinningStyles } from '../../hooks/useTablePinningStyles';

type CustomSingleHeaderRowItemProps = {
  headerGroup: HeaderGroup<ConversationsTableDisplayContent | LeadsTableDisplayContent>;
  isScrolled: boolean;
  isHeaderSticky: boolean;
};

const CustomSingleHeaderRowItem = ({ headerGroup, isScrolled, isHeaderSticky }: CustomSingleHeaderRowItemProps) => {
  const { getCommonPinningStyles } = useTablePinningStyles();
  return (
    <tr key={headerGroup.id} className="relative flex w-full items-start">
      {headerGroup.headers.map((header) => {
        const isLastColumn = headerGroup.headers.indexOf(header) === headerGroup.headers.length - 1;
        const isColumnName = header.id === 'name';
        const isColumnNumberOfUserMessages = header.id === 'number_of_user_messages';
        const isColumnProductOfInterest = header.id === 'product_of_interest';
        const isPinned = header.column.getIsPinned() === 'left';
        const isColumnPinnedLeftForName = isPinned && isColumnName;
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
                'bg-primary': !isPinned && isScrolled,
                // 'bg-primary': ( isScrolled),
                'border-white': isScrolled || isHeaderSticky,
              },
            )}
            style={{
              ...getCommonPinningStyles(header.column),
              backgroundColor: (isPinned && isScrolled) || isHeaderSticky ? 'rgb(var(--primary))' : undefined,
            }}
          >
            <span
              className={cn(`flex-1 text-left text-xs font-medium text-gray-900`, {
                'text-white': isScrolled || isHeaderSticky,
              })}
            >
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
