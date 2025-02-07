import { BANTItem, DEFAULT_LABEL_FOR_SUMMARY_ITEM, SummaryTabContentList } from '../../utils/constants';
import IntentScoreStockupIcon from '@breakout/design-system/components/icons/intent-score-stockup-icon';
import SummaryListChildrenItem from './SummaryListChildrenItem';
import { Link } from 'react-router-dom';
import { cn } from '@breakout/design-system/lib/cn';

const SummaryTabContentItem = ({ listKey, listLabel, listIcon: ItemIcon, listValue }: SummaryTabContentList) => {
  const isIntentScore = listLabel === 'Intent Score:';
  const isEntryPoint = listLabel === 'Entry Point:';
  const getSummaryListValueContent = (listValue: string | number | BANTItem[]) => {
    if (isIntentScore) {
      return <SummaryValueForIntentScore score={listValue as number} />;
    }
    if (isEntryPoint) {
      return (
        <Link to={listValue as string} className="flex-1 text-base font-normal text-blue_sec-1000">
          {listValue as string}
        </Link>
      );
    }
    return <p className="flex-1 text-base font-normal text-gray-900">{listValue as string}</p>;
  };

  const isLabelValueDash = listValue === '-';
  return (
    <div
      className={cn(
        'flex flex-col items-start justify-center gap-4 self-stretch rounded-2xl border border-gray-200 bg-primary/2.5 p-4',
        {
          'w-full flex-row items-center justify-between': isLabelValueDash,
        },
      )}
      key={listKey}
    >
      <div className="flex items-center justify-center gap-2">
        <div className="flex items-center justify-center rounded-lg bg-primary/10 p-1">
          <ItemIcon
            width="16"
            height="16"
            className={cn('text-primary', {
              'text-primary/30': isLabelValueDash,
            })}
          />
        </div>
        <p
          className={cn('flex-1 text-sm font-medium text-gray-500', {
            'text-gray-300': isLabelValueDash,
          })}
        >
          {listLabel}
        </p>
      </div>
      {Array.isArray(listValue) ? (
        <div className="flex w-full flex-col items-start justify-center gap-3">
          {listValue.map((bantItem, index) => (
            <SummaryListChildrenItem
              key={bantItem.itemKey}
              {...bantItem}
              isItemValueDash={bantItem.itemValue === '-'}
              isLastItem={index === listValue.length - 1}
            />
          ))}
        </div>
      ) : isLabelValueDash ? (
        <p className="flex-1 text-right text-sm font-medium italic text-gray-400">{DEFAULT_LABEL_FOR_SUMMARY_ITEM}</p>
      ) : (
        <>{getSummaryListValueContent(listValue)}</>
      )}
    </div>
  );
};

const SummaryValueForIntentScore = ({ score }: { score: number }) => {
  const isPositiveScore = score > 0;
  return (
    <div
      className={cn(`flex h-8 items-center justify-end gap-2 rounded-full py-1 pl-4 pr-2`, {
        'bg-positive-100': isPositiveScore,
        'bg-destructive-100': !isPositiveScore,
      })}
    >
      <p
        className={cn(`text-base font-medium`, {
          'text-positive-1000': isPositiveScore,
          'text-destructive-1000': !isPositiveScore,
        })}
      >
        {score}
      </p>
      <IntentScoreStockupIcon
        className={cn(`h-5 w-5`, {
          'text-positive-1000': isPositiveScore,
          'rotate-90 text-destructive-1000': !isPositiveScore,
        })}
      />
    </div>
  );
};

export default SummaryTabContentItem;
