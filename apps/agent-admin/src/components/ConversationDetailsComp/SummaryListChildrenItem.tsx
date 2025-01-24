import { BANTItem } from '../../utils/constants';

type SummaryListChildrenItemProps = BANTItem & {
  isLastItem: boolean;
};

const SummaryListChildrenItem = ({
  itemKey,
  itemLabel,
  itemValue,
  itemIcon,
  isLastItem,
}: SummaryListChildrenItemProps) => {
  return (
    <div className="flex w-full flex-col items-start justify-center gap-2 self-stretch">
      <div className="flex w-full flex-col items-start gap-2 rounded-lg px-4 py-2" key={itemKey}>
        <div className="flex items-center justify-between gap-1 rounded-full bg-gray-100 py-2 pl-1 pr-4">
          <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gray-200">
            <span className="text-base">{itemIcon}</span>
          </div>
          <p className="text-base font-medium text-gray-500">{itemLabel}</p>
        </div>
        <p className="text-base font-medium text-gray-900">{itemValue}</p>
        {!isLastItem ? <div className="w-full border-b border-gray-200 px-4" /> : null}
      </div>
    </div>
  );
};

export default SummaryListChildrenItem;
