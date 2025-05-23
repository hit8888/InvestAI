import { CellValueProps } from '@meaku/core/types/admin/admin-table';
import React from 'react';
import CustomTooltipWithClipboardUsingHover from '../../CustomTooltipWithClipboardUsingHover';

const UrlCellValue: React.FC<CellValueProps> = ({ value }: { value: string }) => {
  const getTrigger = () => {
    return (
      <div className="w-[500px] truncate">
        <a href={value} className="text-blue_sec-1000" target="_blank" rel="noopener noreferrer">
          {value}
        </a>
      </div>
    );
  };

  return (
    <CustomTooltipWithClipboardUsingHover
      tooltipText={value}
      toastMessage={'URL link copied'}
      showTooltip={true}
      contentMaxWidth="max-w-[500px]"
    >
      {getTrigger()}
    </CustomTooltipWithClipboardUsingHover>
  );
};

export default UrlCellValue;
