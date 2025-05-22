import Typography from '@breakout/design-system/components/Typography/index';
import { CellValueProps } from '@meaku/core/types/admin/admin-table';
import React from 'react';

const DataSourceNameCellValue: React.FC<CellValueProps> = ({ value }: { value: string }) => {
  return (
    <Typography variant={'label-14-medium'} className="w-48 truncate 2xl:w-80">
      {value}
    </Typography>
  );
};

export default DataSourceNameCellValue;
