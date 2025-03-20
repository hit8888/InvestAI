import { cn } from '@breakout/design-system/lib/cn';
import { JSX } from 'react';

type IProps = {
  isTabSelected: boolean;
  tabLabel: string;
  children: JSX.Element;
  handleTabClick: () => void;
};

const SingleTabDisplay = ({ isTabSelected, tabLabel, children, handleTabClick }: IProps) => {
  return (
    <div
      onClick={handleTabClick}
      className={cn('flex cursor-pointer flex-col items-start px-4 pb-4', {
        'border-b-2 border-primary': isTabSelected,
      })}
    >
      <div
        className={cn('flex items-center gap-2 p-2', {
          'rounded-lg bg-primary/20': isTabSelected,
        })}
      >
        <div
          className={cn('flex items-center rounded-lg bg-primary/2.5 p-1', {
            'bg-white': isTabSelected,
          })}
        >
          {children}
        </div>
        <div
          className={cn('text-base font-normal text-gray-500', {
            'font-medium text-primary': isTabSelected,
          })}
        >
          {tabLabel}
        </div>
      </div>
    </div>
  );
};

export default SingleTabDisplay;
