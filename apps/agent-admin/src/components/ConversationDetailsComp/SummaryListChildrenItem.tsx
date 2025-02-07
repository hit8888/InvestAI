import { cn } from '@breakout/design-system/lib/cn';
import { BANTItem, DEFAULT_LABEL_FOR_SUMMARY_ITEM } from '../../utils/constants';

type SummaryListChildrenItemProps = BANTItem & {
  isLastItem: boolean;
  isItemValueDash: boolean;
};

const SummaryListChildrenItem = ({
  itemKey,
  itemLabel,
  itemValue,
  itemIcon,
  isLastItem,
  isItemValueDash,
}: SummaryListChildrenItemProps) => {
  const contentValue = isItemValueDash ? DEFAULT_LABEL_FOR_SUMMARY_ITEM : itemValue;
  return (
    <div className="flex w-full flex-col items-start justify-center gap-2 self-stretch">
      <div
        className={cn('flex w-full flex-col items-start gap-2 rounded-lg px-4 py-2', {
          'w-full flex-row items-center justify-between': isItemValueDash,
        })}
        key={itemKey}
      >
        <div className="flex items-center justify-between gap-1 rounded-full bg-gray-100 py-2 pl-1 pr-4">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200">
            <span className="text-base">{itemIcon}</span>
          </div>
          <p
            className={cn('text-base font-medium text-gray-500', {
              'text-gray-300': isItemValueDash,
            })}
          >
            {itemLabel}
          </p>
        </div>
        <p
          className={cn('text-base font-medium text-gray-900', {
            'text-right text-sm font-medium italic text-gray-400': isItemValueDash,
          })}
        >
          {contentValue}
        </p>
      </div>
      {!isLastItem ? <div className="ml-4 w-[96%] border-b border-gray-200" /> : null}
    </div>
  );
};

export default SummaryListChildrenItem;
