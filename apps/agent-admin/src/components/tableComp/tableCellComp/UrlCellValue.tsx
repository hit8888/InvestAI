import TooltipWrapperDark from '@breakout/design-system/components/Tooltip/TooltipWrapperDark';
import { CellValueProps } from '@meaku/core/types/admin/admin-table';
import React from 'react';

const UrlCellValue: React.FC<CellValueProps> = ({ value }: { value: string }) => {
  const getTrigger = () => {
    return (
      <div className="w-64 truncate 2xl:w-80">
        <a href={value} className="text-blue_sec-1000" target="_blank" rel="noopener noreferrer">
          {value}
        </a>
      </div>
    );
  };
  return <TooltipWrapperDark tooltipAlign="center" trigger={getTrigger()} content={value} showTooltip={true} />;
};

export default UrlCellValue;
