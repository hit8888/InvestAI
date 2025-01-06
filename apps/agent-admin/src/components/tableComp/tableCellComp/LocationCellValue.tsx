import { CellValueProps } from '@meaku/core/types/admin/admin-table';

const LocationCellValue: React.FC<CellValueProps> = ({ value }: { value: string }) => {
  return <span>{value}</span>;
};

export default LocationCellValue;
