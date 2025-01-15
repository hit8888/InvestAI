import { cn } from '@breakout/design-system/lib/cn';
import { CellValueProps } from '@meaku/core/types/admin/admin-table';

const BuyerIntentCellValue: React.FC<CellValueProps> = ({ value }: { value: string }) => {
  const isValueLead = value === 'lead';
  const isValueMedium = value === 'medium';
  const isValueLow = value === 'low';
  return (
    <p
      className={cn('flex items-center justify-center rounded-custom-50 px-2 py-1 text-sm font-medium capitalize', {
        'bg-bluelight-100 text-blue_sec-1000': isValueLead,
        'bg-orange_sec-100 text-orange_sec-1000': isValueMedium,
        'bg-pink_sec-100 text-pink_sec-1000': isValueLow,
      })}
    >
      {value}
    </p>
  );
};

export default BuyerIntentCellValue;
