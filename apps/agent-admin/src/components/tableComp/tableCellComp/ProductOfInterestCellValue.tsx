import { CellValueProps } from '@neuraltrade/core/types/admin/admin-table';

const ProductOfInterestCellValue: React.FC<CellValueProps> = ({ value }: { value: string }) => {
  return (
    <span title={value} className="line-clamp-1 w-full break-all 2xl:w-40">
      {value}
    </span>
  );
};

export default ProductOfInterestCellValue;
