import { cn } from '@breakout/design-system/lib/cn';
import { JSX } from 'react';
import SessionIDCellValue from '../tableComp/tableCellComp/SessionIDCellValue';
import { Skeleton } from '@breakout/design-system/components/shadcn-ui/skeleton';

type IProps = {
  isTakingFullWidth?: boolean;
  children: JSX.Element;
  headerLabel: string;
  itemValue: string;
  isLoading: boolean;
};

const SingleDetailsWithIconHeaderValue = ({
  isTakingFullWidth = false,
  headerLabel,
  itemValue,
  children,
  isLoading,
}: IProps) => {
  return (
    <div
      className={cn('flex items-center gap-4', {
        'flex-1': isTakingFullWidth,
      })}
    >
      <div
        className={cn('flex h-8 w-8 items-end justify-end rounded-lg bg-primary/2.5', {
          'items-center justify-center': isTakingFullWidth,
        })}
      >
        {isLoading ? <Skeleton className="h-8 w-8" /> : children}
      </div>
      <div className="flex flex-col items-start gap-1">
        <div className="text-sm font-normal text-gray-500">
          {isLoading ? <Skeleton className="h-3.5 w-28" /> : headerLabel}
        </div>
        <div className="text-base font-medium text-primary/60">
          {isLoading ? (
            <Skeleton className="h-3.5 w-28" />
          ) : isTakingFullWidth ? (
            <SessionIDCellValue value={itemValue} isTooltipWithClipboard={false} />
          ) : (
            itemValue
          )}
        </div>
      </div>
    </div>
  );
};

export default SingleDetailsWithIconHeaderValue;
