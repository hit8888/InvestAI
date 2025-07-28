import Typography from '@breakout/design-system/components/Typography/index';
import { cn } from '@breakout/design-system/lib/cn';
import AccessibleDiv from '@breakout/design-system/components/accessibility/AccessibleDiv';
import { JSX } from 'react';

type IProps = {
  isTabSelected: boolean;
  tabLabel: string;
  children: JSX.Element;
  handleTabClick: () => void;
};

const SingleTabDisplay = ({ isTabSelected, tabLabel, children, handleTabClick }: IProps) => {
  return (
    <AccessibleDiv
      onClick={handleTabClick}
      className={cn('flex flex-col items-start px-4 pb-4', {
        'border-b-2 border-primary': isTabSelected,
      })}
    >
      <div
        className={cn('flex items-center gap-2', {
          'rounded-lg': isTabSelected,
        })}
      >
        <div
          className={cn('flex items-center rounded-lg bg-primary/5 p-1', {
            'bg-primary': isTabSelected,
          })}
        >
          {children}
        </div>
        <Typography
          variant={isTabSelected ? 'label-16-medium' : 'body-16'}
          textColor={isTabSelected ? 'primary' : 'gray500'}
        >
          {tabLabel}
        </Typography>
      </div>
    </AccessibleDiv>
  );
};

export default SingleTabDisplay;
