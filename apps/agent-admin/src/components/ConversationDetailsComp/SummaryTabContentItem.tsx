import { BANTItem, SummaryTabContentList, NO_INFORMATION_PROVIDED_LABEL, ParentUrlItem } from '../../utils/constants';
import IntentScoreStockupIcon from '@breakout/design-system/components/icons/intent-score-stockup-icon';
import NoInfoProvidedSadFaceIcon from '@breakout/design-system/components/icons/no-info-sadface-icon';
import SummaryListChildrenItem from './SummaryListChildrenItem';
import { Link } from 'react-router-dom';
import { cn } from '@breakout/design-system/lib/cn';
import { getStringWithBothCommaAND } from '../../utils/common';
import BuyerIntentCellValue from '../tableComp/tableCellComp/BuyerIntentCellValue';
import GithubMarkdownRenderer from '@breakout/design-system/components/layout/GithubMarkdownRenderer';
import AssignRepValue from './AssignRepValue';
import { SdrAssignment } from '@meaku/core/types/admin/api';
import GenerateReachoutEmailItem from './GenerateReachoutEmailItem';
import ConversationLogItem from './ConversationLogItem';

const SummaryTabContentItem = ({
  listKey,
  listLabel,
  listIcon: ItemIcon,
  listValue,
  conversation,
  chatHistory,
}: SummaryTabContentList) => {
  const isIntentScore = listKey === 'intentScore';
  const isParentUrl = listKey === 'parentUrl';
  const isAssignRep = listKey === 'assignRep';
  const isSummaryItem = listKey === 'summary';
  const isLengthOfConversation = listKey === 'lengthOfConversation';
  const isBantAnalysisItem = listKey === 'bantAnalysis';
  const isBrowsingHistorySummaryItem = listKey === 'browsingHistorySummary';
  const isLabelValueDash = listValue === '-';
  const isConversationLog = listKey === 'conversationLog';

  const getSummaryListValueContent = (listValue: string | number | BANTItem[] | ParentUrlItem | SdrAssignment) => {
    if (isIntentScore) {
      const isValueNumerical = !isNaN(Number(listValue)) && listValue !== '';
      return isValueNumerical ? (
        <SummaryValueForIntentScore score={Number(listValue)} />
      ) : (
        <BuyerIntentCellValue value={listValue as string} />
      );
    }
    if (isParentUrl && !isLabelValueDash) {
      const { itemLabel, itemValue } = listValue as ParentUrlItem;

      return (
        <Link to={itemValue} className="max-w-sm truncate text-base font-normal text-blue_sec-1000" target="_blank">
          {itemLabel || itemValue}
        </Link>
      );
    }
    if (isAssignRep) {
      return <AssignRepValue listValue={listValue as SdrAssignment} prospectId={conversation?.prospect_id} />;
    }
    if (isSummaryItem || isBrowsingHistorySummaryItem) {
      return <GithubMarkdownRenderer markdown={listValue as string} />;
    }
    return <p className="flex-1 text-base font-normal text-gray-900">{listValue as string}</p>;
  };

  const getNoInformationProvidedLabel = (noInfoString: string) => {
    return (
      <div className="flex items-center justify-center gap-2 rounded-lg bg-gray-100 px-2 py-1">
        <NoInfoProvidedSadFaceIcon className="h-4 w-4 text-gray-500" />
        <p className="flex-1 text-right text-sm font-medium italic text-gray-500">{noInfoString}</p>
      </div>
    );
  };

  const showBantItemsHavingDashValue = () => {
    if (Array.isArray(listValue)) {
      const bantItemsWithDash = listValue
        .filter((item) => item.itemValue === '-')
        .map((item) => item.itemLabel.replace(':', ''));
      const bantItemsWithDashString = getStringWithBothCommaAND(bantItemsWithDash);
      const isBantItemsWithDashEqualTo4 = bantItemsWithDash.length === 4;

      if (bantItemsWithDashString === '') return null;
      return (
        <div
          className={cn('flex w-full items-center justify-end', {
            'justify-start': isBantItemsWithDashEqualTo4,
          })}
        >
          {getNoInformationProvidedLabel(`${bantItemsWithDashString} ${NO_INFORMATION_PROVIDED_LABEL}`)}
        </div>
      );
    }
  };

  if (isConversationLog) {
    return <ConversationLogItem chatHistory={chatHistory} conversation={conversation} />;
  }

  if (listKey === 'reachoutEmail') {
    return <GenerateReachoutEmailItem sessionId={conversation?.session_id} />;
  }

  return (
    <div
      className={cn(
        'flex w-full max-w-full items-start justify-between gap-4 self-stretch overflow-auto rounded-2xl border border-gray-200 bg-primary/2.5 p-4',
        {
          'w-full flex-row items-center justify-between':
            isLabelValueDash || isAssignRep || isIntentScore || isLengthOfConversation,
          'flex-col justify-center':
            (isSummaryItem || isBantAnalysisItem || isBrowsingHistorySummaryItem) && !isLabelValueDash,
        },
      )}
      key={listKey}
    >
      <div className="flex w-[50%] items-center justify-center gap-2">
        {ItemIcon && (
          <div className="flex items-center justify-center rounded-lg bg-primary/10 p-1">
            <ItemIcon
              width="16"
              height="16"
              className={cn('text-primary', {
                'text-primary/30': isLabelValueDash,
              })}
            />
          </div>
        )}
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
          {showBantItemsHavingDashValue()}
        </div>
      ) : isLabelValueDash ? (
        <>{getNoInformationProvidedLabel(`This ${NO_INFORMATION_PROVIDED_LABEL}`)}</>
      ) : (
        <div className="flex justify-end">{getSummaryListValueContent(listValue)}</div>
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
