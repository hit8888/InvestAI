import { cn } from '@breakout/design-system/lib/cn';

type BuyerIntentCellValueProps = {
  value: string;
  withDot?: boolean;
};

const BuyerIntentCellValue: React.FC<BuyerIntentCellValueProps> = ({ value, withDot = false }) => {
  const safeValue = typeof value === 'string' ? value.toLowerCase() : '';
  const isValueLead = safeValue.includes('lead') || safeValue.includes('high');
  const isValueMedium = safeValue.includes('medium');
  const isValueLow = safeValue.includes('low');
  return (
    <p
      className={cn('flex items-center justify-center rounded-custom-50 px-2 py-1 text-sm font-medium capitalize', {
        'text-pink_sec-1000': isValueLead,
        'text-orange_sec-1000': isValueMedium,
        'text-bluegray-1000': isValueLow,
        'bg-pink_sec-50': isValueLead && !withDot,
        'bg-orange_sec-50': isValueMedium && !withDot,
        'bg-bluegray-50': isValueLow && !withDot,
        'gap-1 bg-none': withDot && (isValueLead || isValueMedium || isValueLow),
      })}
    >
      {withDot && (
        <span
          className={cn('h-2 w-2 rounded-full', {
            'bg-pink_sec-1000': isValueLead,
            'bg-orange_sec-1000': isValueMedium,
            'bg-bluegray-1000': isValueLow,
          })}
        ></span>
      )}
      {value}
    </p>
  );
};

export default BuyerIntentCellValue;
