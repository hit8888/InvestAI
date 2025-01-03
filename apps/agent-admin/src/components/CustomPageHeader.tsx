import { JSX } from 'react';
import Separator from '@breakout/design-system/components/layout/separator';

type CustomPageHeaderProps = {
  headerTitle: string;
  headerIcon?: JSX.Element;
};

const CustomPageHeader = ({ headerTitle, headerIcon }: CustomPageHeaderProps) => {
  return (
    <div className="flex flex-col items-start gap-4 self-stretch">
      <div className="flex items-center gap-4">
        <div className="flex h-12 w-12 items-center justify-center gap-2.5 rounded-lg bg-primary/5">{headerIcon}</div>
        <p className="text-4xl font-semibold text-gray-900">{headerTitle}</p>
      </div>
      <Separator />
    </div>
  );
};

export default CustomPageHeader;
