import { CellValueProps } from '@neuraltrade/core/types/admin/admin-table';

const BANTAnalysisCellValue: React.FC<CellValueProps> = ({ value }: { value: string }) => {
  return (
    <span title={value} className="w-48 truncate 2xl:w-40">
      {value}
    </span>
  );
};

export default BANTAnalysisCellValue;
