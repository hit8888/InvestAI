import Typography from '@breakout/design-system/components/Typography/index';
import { CellValueProps } from '@meaku/core/types/admin/admin-table';
import React from 'react';
import DataSourcePdfIcon from '@breakout/design-system/components/icons/data-source-pdf-icon';

const NameCellValue: React.FC<CellValueProps> = ({ value }: { value: string }) => {
  return (
    <div className="flex items-center gap-2">
      <div className="flex items-center rounded bg-bluegray-200 p-1">
        <DataSourcePdfIcon className="text-bluegray-700" width={16} height={16} />
      </div>
      <Typography variant={'body-16'} className="w-48 truncate 2xl:w-40">
        {value}
      </Typography>
    </div>
  );
};

export default NameCellValue;
