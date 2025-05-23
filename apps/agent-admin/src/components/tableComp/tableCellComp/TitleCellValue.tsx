import { CellValueProps } from '@meaku/core/types/admin/admin-table';
import React from 'react';

const TitleCellValue: React.FC<CellValueProps> = ({ value }: { value: string }) => {
  return (
    <span title={value} className="w-60 truncate 2xl:w-60">
      {value}
    </span>
  );
};

export default TitleCellValue;
