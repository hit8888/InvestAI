import Typography from '@breakout/design-system/components/Typography/index';
import { CellValueProps } from '@meaku/core/types/admin/admin-table';
import React from 'react';

const SourcesPageTypeCellValue: React.FC<CellValueProps> = ({ value }: { value: string }) => {
  return (
    <Typography variant="label-14-medium" className="flex-1 text-left capitalize">
      {value.replace(/_/g, ' ').toLowerCase()}
    </Typography>
  );
};

export default SourcesPageTypeCellValue;
