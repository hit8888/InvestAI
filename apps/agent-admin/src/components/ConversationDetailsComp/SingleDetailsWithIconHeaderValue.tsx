import { cn } from '@breakout/design-system/lib/cn';
import { JSX } from 'react';

type IProps = {
  isTakingFullWidth?: boolean;
  children: JSX.Element;
  headerLabel: string;
  itemValue: string;
};

const SingleDetailsWithIconHeaderValue = ({ isTakingFullWidth = false, headerLabel, itemValue, children }: IProps) => {
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
        {children}
      </div>
      <div className="flex flex-col items-start gap-1">
        <p className="text-sm font-normal text-gray-500">{headerLabel}</p>
        <p
          className={cn('text-base font-medium text-primary/60', {
            'max-w-40 overflow-hidden text-ellipsis whitespace-nowrap': isTakingFullWidth,
          })}
          title={itemValue}
        >
          {itemValue}
        </p>
      </div>
    </div>
  );
};

export default SingleDetailsWithIconHeaderValue;
