import { CellValueProps } from '@neuraltrade/core/types/admin/admin-table';
import React from 'react';
import DataSourceStatusChip from './DataSourceStatusChip';
import { DATA_SOURCE_STATUS } from '../../../pages/DataSourcesPage/constants';

const StatusCellValue: React.FC<CellValueProps> = ({ value }: { value: string }) => {
  return <DataSourceStatusChip status={value.toUpperCase() as DATA_SOURCE_STATUS} />;
};

export default StatusCellValue;
