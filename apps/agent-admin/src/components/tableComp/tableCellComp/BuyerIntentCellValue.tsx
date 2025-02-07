import { cn } from '@breakout/design-system/lib/cn';
import { CellValueProps } from '@meaku/core/types/admin/admin-table';

const BuyerIntentCellValue: React.FC<CellValueProps> = ({ value }: { value: string }) => {
  const safeValue = typeof value === 'string' ? value : '';
  const isValueLead = safeValue.includes('lead') || safeValue.includes('high');
  const isValueMedium = safeValue.includes('medium');
  const isValueLow = safeValue.includes('low');
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
