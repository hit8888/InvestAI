import { CellValueProps } from '@meaku/core/types/admin/admin-table';
import React from 'react';
import CustomTooltipWithClipboardUsingHover from '../../CustomTooltipWithClipboardUsingHover';

const MAX_WIDTH_CLASS = 'max-w-[500px]';

const UrlCellValue: React.FC<CellValueProps> = ({ value }: { value: string }) => {
  const getTrigger = () => {
    return (
      <div className={`w-fit ${MAX_WIDTH_CLASS} truncate`}>
        <a href={value} className="text-blue_sec-1000" target="_blank" rel="noopener noreferrer">
          {value}
        </a>
      </div>
    );
  };

  return (
    <CustomTooltipWithClipboardUsingHover
      showTooltip
      showArrow
      tooltipText={value}
      toastMessage={'URL link copied'}
      tooltipAlign="start"
      contentMaxWidth={MAX_WIDTH_CLASS}
    >
      {getTrigger()}
    </CustomTooltipWithClipboardUsingHover>
  );
};

export default UrlCellValue;
