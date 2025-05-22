import { CellValueProps } from '@meaku/core/types/admin/admin-table';
import React from 'react';

const NameCellValue: React.FC<CellValueProps> = ({ value }: { value: string }) => {
  return (
    <span title={value} className="w-48 truncate 2xl:w-40">
      {value}
    </span>
  );
};

export default NameCellValue;
