import { CellValueProps } from '@meaku/core/types/admin/admin-table';
import React from 'react';

const DataSourceTypeCellValue: React.FC<CellValueProps> = ({ value }: { value: string }) => {
  return (
    <span title={value} className="w-full truncate 2xl:w-40">
      {value}
    </span>
  );
};

export default DataSourceTypeCellValue;
