import { flexRender, Header, HeaderGroup } from '@tanstack/react-table';
import {
  ConversationsTableDisplayContent,
  LeadsTableDisplayContent,
  VisitorsTableDisplayContent,
} from '@meaku/core/types/admin/admin';
import { cn } from '@breakout/design-system/lib/cn';
import { useTablePinningStyles } from '../../hooks/useTablePinningStyles';
import { LEADS_PAGE, LINK_CLICKS_PAGE, SHADOW_PINNED_COLUMNS, VISITORS_PAGE } from '@meaku/core/utils/index';
import { PaginationPageType } from '@meaku/core/types/admin/admin';
import { SortCategory, SortOrder } from '@meaku/core/types/admin/sort';
import { SortValues } from '@meaku/core/types/admin/sort';
import SortFilterButton from './SortFilterButton';

const HIDE_ACTION_ITEMS_FOR_COLUMNS = ['updated_on', 'company', 'sdr_assignment'];

type CustomSingleHeaderRowItemProps = {
  headerGroup: HeaderGroup<ConversationsTableDisplayContent | LeadsTableDisplayContent | VisitorsTableDisplayContent>;
  pageType: PaginationPageType;
  setSortValue: (page: PaginationPageType, category: SortCategory, value: string | SortOrder) => void;
  sortValue: SortValues;
  columnClassNames?: { [columnId: string]: string };
};

const CustomSingleHeaderRowItem = ({
  headerGroup,
  pageType,
  setSortValue,
  sortValue,
  columnClassNames,
}: CustomSingleHeaderRowItemProps) => {
  const { getCommonPinningStyles } = useTablePinningStyles();
  const isLeadsOrLinkClicksPage = pageType === LEADS_PAGE || pageType === LINK_CLICKS_PAGE;
  const isVisitorsPage = pageType === VISITORS_PAGE;
  return (
    <tr key={headerGroup.id} className="relative flex w-full items-start">
      {headerGroup.headers.map((header) => {
        const isLastColumn = headerGroup.headers.indexOf(header) === headerGroup.headers.length - 1;
        const isShadowedColumn = SHADOW_PINNED_COLUMNS.includes(header.id);
        const isColumnNumberOfUserMessages = header.id === 'user_message_count';
        const isColumnProductOfInterest = header.id === 'product_of_interest';
        const hideActionItems =
          (isVisitorsPage && !HIDE_ACTION_ITEMS_FOR_COLUMNS.includes(header.id)) ||
          (isLeadsOrLinkClicksPage && header.id === 'buyer_intent');
        const isPinned = header.column.getIsPinned() === 'left';
        const isColumnPinnedLeftForName = isPinned && isShadowedColumn;
        return (
          <th
            key={header.id}
            colSpan={header.colSpan}
            className={cn(
              `relative flex min-h-12 flex-1 items-center gap-2 border-b border-t border-gray-300 bg-gray-100 p-2.5`,
              {
                'border-r': !isLastColumn,
                'w-28 truncate 2xl:w-40': isColumnProductOfInterest,
                'min-w-56': isColumnNumberOfUserMessages,
                pinnedColumnShadow: isColumnPinnedLeftForName,
              },
              columnClassNames?.[header.id],
            )}
            style={{
              ...getCommonPinningStyles(header.column),
              backgroundColor: isPinned ? '#F2F4F7' : undefined,
            }}
          >
            <HeaderCellContent
              header={header}
              sortValue={sortValue}
              setSortValue={setSortValue}
              pageType={pageType}
              hideActionItems={hideActionItems}
            />
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

type HeaderCellContentProps = {
  header: Header<ConversationsTableDisplayContent | LeadsTableDisplayContent | VisitorsTableDisplayContent, unknown>;
  sortValue: SortValues;
  setSortValue: (page: PaginationPageType, category: SortCategory, value: string | SortOrder) => void;
  pageType: PaginationPageType;
  hideActionItems: boolean;
};

const HeaderCellContent = ({ header, sortValue, setSortValue, pageType, hideActionItems }: HeaderCellContentProps) => {
  return (
    <div className="flex w-full items-center justify-between">
      <span className={cn(`flex-1 text-left text-xs font-medium text-gray-500`)}>
        {header.isPlaceholder ? null : flexRender(header.column.columnDef.header, header.getContext())}
      </span>
      {!hideActionItems && (
        <SortFilterButton header={header} sortValue={sortValue} setSortValue={setSortValue} pageType={pageType} />
      )}
    </div>
  );
};

export default CustomSingleHeaderRowItem;
