import TooltipWrapperDark from '@breakout/design-system/components/Tooltip/TooltipWrapperDark';
import { CellValueProps } from '@neuraltrade/core/types/admin/admin-table';
import React from 'react';

const TitleCellValue: React.FC<CellValueProps> = ({ value }: { value: string }) => {
  return (
    <TooltipWrapperDark
      showTooltip
      trigger={<p className="w-60 truncate 2xl:w-60">{value}</p>}
      content={value}
      tooltipAlign="center"
    />
  );
};

export default TitleCellValue;
