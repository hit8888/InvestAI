import { CellValueProps } from '@meaku/core/types/admin/admin-table';

const AccessTypeCellValue: React.FC<CellValueProps> = ({ value }: { value: string }) => {
  return <p className="capitalize">{value.toLowerCase()}</p>;
};

export default AccessTypeCellValue;
