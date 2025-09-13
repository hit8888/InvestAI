import { JSX } from 'react';
import Separator from '@breakout/design-system/components/layout/separator';
import { cn } from '@breakout/design-system/lib/cn';

type CustomPageHeaderProps = {
  headerTitle: string | JSX.Element;
  headerIcon?: JSX.Element;
  className?: string;
};

const CustomPageHeader = ({ headerTitle, headerIcon, className }: CustomPageHeaderProps) => {
  return (
    <div className={cn('flex flex-col items-start gap-4 self-stretch', className)}>
      <div className="flex items-center gap-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 p-1">{headerIcon}</div>
        <div className="text-base font-semibold text-primary">{headerTitle}</div>
      </div>
      <Separator />
    </div>
  );
};

export default CustomPageHeader;
