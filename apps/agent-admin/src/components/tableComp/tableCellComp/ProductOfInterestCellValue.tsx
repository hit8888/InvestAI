import { CellValueProps } from '@meaku/core/types/admin/admin-table';

const ProductOfInterestCellValue: React.FC<CellValueProps> = ({ value }: { value: string }) => {
  return (
    <span title={value} className="w-32 truncate 2xl:w-40">
      {value}
    </span>
  );
};

export default ProductOfInterestCellValue;
