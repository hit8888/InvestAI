import { JSX } from 'react';
import Separator from '@breakout/design-system/components/layout/separator';

type CustomPageHeaderProps = {
  headerTitle: string | JSX.Element;
  headerIcon?: JSX.Element;
};

const CustomPageHeader = ({ headerTitle, headerIcon }: CustomPageHeaderProps) => {
  return (
    <div className="flex flex-col items-start gap-4 self-stretch">
      <div className="flex items-center gap-4">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10 p-1">{headerIcon}</div>
        <p className="text-base font-semibold text-primary">{headerTitle}</p>
      </div>
      <Separator />
    </div>
  );
};

export default CustomPageHeader;
