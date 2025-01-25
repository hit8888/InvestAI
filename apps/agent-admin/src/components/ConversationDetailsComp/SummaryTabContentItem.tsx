import { BANTItem, COMMON_SMALL_ICON_PROPS, SummaryTabContentList } from '../../utils/constants';
import IntentScoreStockupIcon from '@breakout/design-system/components/icons/intent-score-stockup-icon';
import SummaryListChildrenItem from './SummaryListChildrenItem';
import { Link } from 'react-router-dom';

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
  return (
    <div
      className="flex flex-col items-start justify-center gap-4 self-stretch rounded-2xl border border-gray-200 bg-primary/2.5 p-4"
      key={listKey}
    >
      <div className="flex items-center justify-center gap-2">
        <div className="flex items-center justify-center rounded-lg bg-primary/10 p-1">
          <ItemIcon {...COMMON_SMALL_ICON_PROPS} />
        </div>
        <p className="flex-1 text-sm font-medium text-gray-500">{listLabel}</p>
      </div>
      {Array.isArray(listValue) ? (
        <div className="flex w-full flex-col items-start justify-center gap-3">
          {listValue.map((bantItem, index) => (
            <SummaryListChildrenItem key={bantItem.itemKey} {...bantItem} isLastItem={index === listValue.length - 1} />
          ))}
        </div>
      ) : (
        <>{getSummaryListValueContent(listValue)}</>
      )}
    </div>
  );
};

const SummaryValueForIntentScore = ({ score }: { score: number }) => {
  return (
    <div className="flex h-8 items-center justify-end gap-2 rounded-full bg-positive-100 py-1 pl-4 pr-2">
      <p className="text-base font-medium text-positive-1000">{score}</p>
      <IntentScoreStockupIcon className="h-5 w-5 text-positive-1000" />
    </div>
  );
};

export default SummaryTabContentItem;
