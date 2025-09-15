import { cn } from '@breakout/design-system/lib/cn';
import AccessibleTableRow from '../accessibility/AccessibleTableRow';
import { Cell, flexRender, Row } from '@tanstack/react-table';
import {
  ConversationsTableDisplayContent,
  LeadsTableDisplayContent,
  VisitorsTableDisplayContent,
} from '@meaku/core/types/admin/admin';
import { useTablePinningStyles } from '../../hooks/useTablePinningStyles';
import { SHADOW_PINNED_COLUMNS } from '@meaku/core/utils/index';
import LogoImage from '../LogoImage';

export type CustomSingleBodyRowItemWithLogoProps = {
  logo?: { [columnId: string]: { src: string; placeholderText: string } };
  row: Row<ConversationsTableDisplayContent | LeadsTableDisplayContent | VisitorsTableDisplayContent>;
  handleRowItemClick: (
    row: ConversationsTableDisplayContent | LeadsTableDisplayContent | VisitorsTableDisplayContent,
  ) => void;
  pageType?: string;
  relatedEntities?: Record<string, string[]>;
  columnClassNames?: { [columnId: string]: string };
  /**
   * Custom cell renderers for specific columns.
   * Key should be the column ID, value should be a function that takes a cell and returns a React node.
   * Example: { 'sdr_assignment': (cell) => <CustomComponent value={cell.getValue()} /> }
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  customCellRenderers?: { [columnId: string]: (cell: Cell<any, any>) => React.ReactNode };
};

const TableBodyRowItemHavingLogo = ({
  row,
  logo,
  handleRowItemClick,
  relatedEntities,
  columnClassNames,
  customCellRenderers,
}: CustomSingleBodyRowItemWithLogoProps) => {
  const { getCommonPinningStyles } = useTablePinningStyles();

  const handleRowItemClickHandler = () => {
    handleRowItemClick(row.original);
  };

  return (
    <AccessibleTableRow
      key={row.id}
      onClick={handleRowItemClickHandler}
      clickable={true}
      className={cn('flex w-full items-start self-stretch bg-white')}
    >
      {row.getVisibleCells().map((cell) => {
        const isLastColumn = row.getVisibleCells().indexOf(cell) === row.getVisibleCells().length - 1;
        const isPinned = cell.column.getIsPinned() === 'left';
        const isShadowedColumn = SHADOW_PINNED_COLUMNS.includes(cell.column.id);
        const isColumnPinnedLeftForName = isPinned && isShadowedColumn;
        const relatedEntitiesData = relatedEntities?.[cell.column.id];
        const relatedValuesLabel = relatedEntitiesData
          ?.map((relatedEntity: string): string | null => {
            const value = row.original[relatedEntity as keyof typeof row.original];
            return (value as string) || null;
          })
          .filter((value): value is string => value !== null)
          .join(', ');
        const logoSrc = logo?.[cell.column.id]?.src;
        const logoPlaceholderText = logo?.[cell.column.id]?.placeholderText;

        const customRenderer = customCellRenderers?.[cell.column.id];
        return (
          <td
            key={cell.id}
            className={cn(
              `border-gray/20 flex h-14 min-w-0 flex-1 flex-col items-start justify-center border-b px-2 py-3 text-gray-900`,
              {
                'border-r': !isLastColumn,
                pinnedColumnShadow: isColumnPinnedLeftForName,
              },
              columnClassNames?.[cell.column.id],
            )}
            style={{ ...getCommonPinningStyles(cell.column) }}
          >
            {customRenderer ? (
              customRenderer(cell)
            ) : (
              <div className="flex w-full min-w-0 items-center gap-2">
                {(logoSrc || logoPlaceholderText) && (
                  <div className="h-6 w-6 flex-shrink-0">
                    <LogoImage src={logoSrc} placeholderText={logoPlaceholderText} />
                  </div>
                )}
                <div className="flex min-w-0 flex-1 flex-col justify-center overflow-hidden text-sm font-normal">
                  <div className="truncate [&>span]:!w-auto [&>span]:max-w-full [&>span]:truncate">
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </div>
                  {relatedValuesLabel && <div className="truncate text-xs text-gray-500">{relatedValuesLabel}</div>}
                </div>
              </div>
            )}
          </td>
        );
      })}
    </AccessibleTableRow>
  );
};

TableBodyRowItemHavingLogo.displayName = 'TableBodyRowItemHavingLogo';

export default TableBodyRowItemHavingLogo;
